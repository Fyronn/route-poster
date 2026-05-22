using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Trips;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class TripService : ITripService
    {
        private readonly ITripRepository _tripRepository;
        private readonly ITripAssignmentRepository _tripAssignmentRepository;

        public TripService(ITripRepository tripRepository, ITripAssignmentRepository tripAssignmentRepository)
        {
            _tripRepository = tripRepository;
            _tripAssignmentRepository = tripAssignmentRepository;
        }

        public async Task<IEnumerable<TripDto>> GetAllAsync()
        {
            var entities = await _tripRepository.GetAllAsync();
            return entities.Select(MapToDto);
        }
        
        public async Task<IEnumerable<TripDto>> GetByRouteIdAsync(int routeId)
        {
            var entities = await _tripRepository.FindAsync(t => t.RouteId == routeId);
            return entities.Select(MapToDto);
        }

        public async Task<TripDto> CreateAsync(CreateTripDto dto)
        {
            var entity = new Tbltrip
            {
                RouteId = dto.RouteId,
                TripDate = dto.TripDate,
                StartedAt = dto.StartTime,
                CompletedAt = dto.EndTime,
                Status = "Planned"
            };

            await _tripRepository.AddAsync(entity);
            await _tripRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        private TripDto MapToDto(Tbltrip entity)
        {
            return new TripDto
            {
                TripId = entity.Id,
                RouteId = entity.RouteId,
                TripDate = entity.TripDate,
                StartTime = entity.StartedAt,
                EndTime = entity.CompletedAt,
                Status = entity.Status
            };
        }

        public async Task<TripDto?> StartTripAsync(int tripId, int driverId)
        {
            var entity = await _tripRepository.GetByIdAsync(tripId);
            if (entity == null) return null;

            // Verify assignment
            var assignments = await _tripAssignmentRepository.FindAsync(ta => ta.TripId == tripId && ta.DriverId == driverId);
            if (!assignments.Any())
            {
                throw new InvalidOperationException("Driver is not assigned to this trip.");
            }

            entity.Status = "Started";
            entity.StartedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _tripRepository.Update(entity);
            await _tripRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<TripDto?> EndTripAsync(int tripId, int driverId)
        {
            var entity = await _tripRepository.GetByIdAsync(tripId);
            if (entity == null) return null;

            // Verify assignment
            var assignments = await _tripAssignmentRepository.FindAsync(ta => ta.TripId == tripId && ta.DriverId == driverId);
            if (!assignments.Any())
            {
                throw new InvalidOperationException("Driver is not assigned to this trip.");
            }

            entity.Status = "Completed";
            entity.CompletedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _tripRepository.Update(entity);
            await _tripRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<TripAssignmentStatusDto> CheckAssignmentStatusByRouteIdAsync(int routeId)
        {
            var trips = await _tripRepository.FindAsync(t => t.RouteId == routeId);
            var latestTrip = trips.OrderByDescending(t => t.Id).FirstOrDefault();

            if (latestTrip == null)
            {
                return new TripAssignmentStatusDto { IsAssigned = false, TripId = null };
            }

            var assignments = await _tripAssignmentRepository.FindAsync(ta => ta.TripId == latestTrip.Id);
            bool isAssigned = assignments.Any();

            return new TripAssignmentStatusDto { IsAssigned = isAssigned, TripId = latestTrip.Id };
        }
    }
}
