using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.TripAssignments;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class TripAssignmentService : ITripAssignmentService
    {
        private readonly ITripAssignmentRepository _repository;

        public TripAssignmentService(ITripAssignmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TripAssignmentDto>> GetAllAsync()
        {
            var assignments = await _repository.GetAllWithDetailsAsync();
            return assignments.Select(a => new TripAssignmentDto
            {
                Id = a.Id,
                TripId = a.TripId,
                VehicleId = a.VehicleId,
                DriverId = a.DriverId,
                TripDate = a.Trip?.TripDate,
                VehiclePlateNumber = a.Vehicle?.PlateNumber,
                DriverFirstName = a.Driver?.FirstName,
                DriverLastName = a.Driver?.LastName,
                ServiceSupervisorId = a.ServiceSupervisorId,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                CreatedBy = a.CreatedBy
            });
        }

        public async Task<TripAssignmentDto?> GetByIdAsync(int id)
        {
            var assignment = await _repository.GetByIdWithDetailsAsync(id);
            if (assignment == null) return null;

            return new TripAssignmentDto
            {
                Id = assignment.Id,
                TripId = assignment.TripId,
                VehicleId = assignment.VehicleId,
                DriverId = assignment.DriverId,
                TripDate = assignment.Trip?.TripDate,
                VehiclePlateNumber = assignment.Vehicle?.PlateNumber,
                DriverFirstName = assignment.Driver?.FirstName,
                DriverLastName = assignment.Driver?.LastName,
                ServiceSupervisorId = assignment.ServiceSupervisorId,
                CreatedAt = assignment.CreatedAt,
                UpdatedAt = assignment.UpdatedAt,
                CreatedBy = assignment.CreatedBy
            };
        }

        public async Task<TripAssignmentDto> CreateAsync(CreateTripAssignmentDto dto)
        {
            var assignment = new TbltripAssignment
            {
                TripId = dto.TripId,
                VehicleId = dto.VehicleId,
                DriverId = dto.DriverId,
                ServiceSupervisorId = dto.ServiceSupervisorId,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(assignment);
            await _repository.SaveChangesAsync();

            return new TripAssignmentDto
            {
                Id = assignment.Id,
                TripId = assignment.TripId,
                VehicleId = assignment.VehicleId,
                DriverId = assignment.DriverId,
                ServiceSupervisorId = assignment.ServiceSupervisorId,
                CreatedAt = assignment.CreatedAt,
                UpdatedAt = assignment.UpdatedAt,
                CreatedBy = assignment.CreatedBy
            };
        }

        public async Task UpdateAsync(int id, UpdateTripAssignmentDto dto)
        {
            var assignment = await _repository.GetByIdAsync(id);
            if (assignment != null)
            {
                assignment.TripId = dto.TripId;
                assignment.VehicleId = dto.VehicleId;
                assignment.DriverId = dto.DriverId;
                assignment.ServiceSupervisorId = dto.ServiceSupervisorId;
                assignment.UpdatedAt = DateTime.UtcNow;

                _repository.Update(assignment);
                await _repository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var assignment = await _repository.GetByIdAsync(id);
            if (assignment != null)
            {
                _repository.Remove(assignment);
                await _repository.SaveChangesAsync();
            }
        }
    }
}
