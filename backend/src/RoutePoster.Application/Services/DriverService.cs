using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Drivers;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class DriverService : IDriverService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ITripAssignmentRepository _tripAssignmentRepository;
        private const int DriverRoleId = 5;

        public DriverService(IEmployeeRepository employeeRepository, ITripAssignmentRepository tripAssignmentRepository)
        {
            _employeeRepository = employeeRepository;
            _tripAssignmentRepository = tripAssignmentRepository;
        }

        public async Task<IEnumerable<DriverDto>> GetAllAsync()
        {
            var entities = await _employeeRepository.FindAsync(e => e.RoleId == DriverRoleId);
            return entities.Select(MapToDto);
        }

        public async Task<DriverDto?> GetByIdAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null || entity.RoleId != DriverRoleId) return null;
            return MapToDto(entity);
        }

        public async Task<DriverDto> CreateAsync(CreateDriverDto dto)
        {
            var entity = new Tbluser
            {
                RoleId = DriverRoleId,
                IdentityNumber = dto.IdentityNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = dto.PasswordHash ?? "default_hash", 
                IsActive = dto.IsActive ?? true,
                CreatedAt = DateTime.UtcNow
            };

            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateAsync(int id, UpdateDriverDto dto)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RoleId == DriverRoleId)
            {
                entity.IdentityNumber = dto.IdentityNumber;
                entity.FirstName = dto.FirstName;
                entity.LastName = dto.LastName;
                entity.Email = dto.Email;
                entity.Phone = dto.Phone;
                entity.IsActive = dto.IsActive;

                _employeeRepository.Update(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RoleId == DriverRoleId)
            {
                _employeeRepository.Remove(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        private DriverDto MapToDto(Tbluser entity)
        {
            return new DriverDto
            {
                UserId = entity.Id,
                IdentityNumber = entity.IdentityNumber,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                IsActive = entity.IsActive
            };
        }

        public async Task<IEnumerable<DriverPlannedTripDto>> GetPlannedTripsForDriverAsync(int driverId)
        {
            var assignments = await _tripAssignmentRepository.GetPlannedAssignmentsByDriverIdAsync(driverId);
            
            var result = new List<DriverPlannedTripDto>();
            foreach (var assignment in assignments)
            {
                var trip = assignment.Trip;
                if (trip == null) continue;

                var route = trip.Route;
                if (route == null) continue;

                var tripDto = new DriverPlannedTripDto
                {
                    TripId = trip.Id,
                    TripDate = trip.TripDate,
                    Status = trip.Status,
                    VehicleId = assignment.VehicleId,
                    VehiclePlateNumber = assignment.Vehicle?.PlateNumber,
                    RouteId = route.Id,
                    RouteName = route.RouteName,
                    PlannedStartTime = route.PlannedStartTime,
                    Stops = route.TblrouteStops
                        .Select(rs => new DriverPlannedTripStopDto
                        {
                            StopId = rs.StopId,
                            StopName = rs.Stop?.StopName ?? "Bilinmeyen Durak",
                            StopOrder = rs.StopOrder,
                            TargetArrivalTime = rs.TargetArrivalTime,
                            Latitude = rs.Stop?.Latitude,
                            Longitude = rs.Stop?.Longitude
                        })
                        .OrderBy(s => s.StopOrder)
                        .ToList()
                };

                result.Add(tripDto);
            }

            return result;
        }

        public async Task<IEnumerable<DriverAssignedTripDto>> GetAssignedTripsForDriverAsync(int driverId, string? status = null)
        {
            var assignments = await _tripAssignmentRepository.GetAssignmentsByDriverIdAsync(driverId, status);
            
            var result = new List<DriverAssignedTripDto>();
            foreach (var assignment in assignments)
            {
                var trip = assignment.Trip;
                if (trip == null) continue;

                var route = trip.Route;
                if (route == null) continue;

                var tripDto = new DriverAssignedTripDto
                {
                    TripId = trip.Id,
                    TripDate = trip.TripDate,
                    Status = trip.Status,
                    VehicleId = assignment.VehicleId,
                    VehiclePlateNumber = assignment.Vehicle?.PlateNumber,
                    RouteId = route.Id,
                    RouteName = route.RouteName,
                    PlannedStartTime = route.PlannedStartTime,
                    Stops = route.TblrouteStops
                        .Select(rs => new DriverAssignedTripStopDto
                        {
                            StopId = rs.StopId,
                            StopName = rs.Stop?.StopName ?? "Bilinmeyen Durak",
                            StopOrder = rs.StopOrder,
                            TargetArrivalTime = rs.TargetArrivalTime,
                            Latitude = rs.Stop?.Latitude,
                            Longitude = rs.Stop?.Longitude
                        })
                        .OrderBy(s => s.StopOrder)
                        .ToList()
                };

                result.Add(tripDto);
            }

            return result;
        }
    }
}
