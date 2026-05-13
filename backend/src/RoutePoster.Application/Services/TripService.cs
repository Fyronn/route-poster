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

        public TripService(ITripRepository tripRepository)
        {
            _tripRepository = tripRepository;
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
    }
}
