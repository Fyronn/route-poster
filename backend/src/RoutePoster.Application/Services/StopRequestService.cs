using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Stops;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class StopRequestService : IStopRequestService
    {
        private readonly IStopRequestRepository _stopRequestRepository;

        public StopRequestService(IStopRequestRepository stopRequestRepository)
        {
            _stopRequestRepository = stopRequestRepository;
        }

        public async Task<IEnumerable<StopRequestDto>> GetByClientIdAsync(int clientId)
        {
            var entities = await _stopRequestRepository.GetWithRoutesByClientIdAsync(clientId);
            var result = new System.Collections.Generic.List<StopRequestDto>();

            foreach (var stop in entities)
            {
                if (stop.TblrouteStops != null && stop.TblrouteStops.Any())
                {
                    foreach (var routeStop in stop.TblrouteStops)
                    {
                        var dto = MapToDto(stop);
                        // Overwrite with the specific route for this combination
                        dto.RouteId = routeStop.RouteId;
                        dto.RouteName = routeStop.Route?.RouteName;
                        result.Add(dto);
                    }
                }
                else
                {
                    // Add stop even if it has no routes associated
                    result.Add(MapToDto(stop));
                }
            }

            return result;
        }

        public async Task<StopRequestDto?> GetByIdAsync(int id)
        {
            var entity = await _stopRequestRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<StopRequestDto> CreateAsync(CreateStopRequestDto dto)
        {
            var entity = new Tblstop
            {
                ClientId = dto.ClientId,
                StopName = dto.StopName ?? string.Empty,
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                OperatorNote = dto.OperatorNote,
                Status = "Requested",
                IsActive = true,
                TransportCompanyId = 1 // Default
            };

            await _stopRequestRepository.AddAsync(entity);
            await _stopRequestRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateAsync(int id, UpdateStopRequestDto dto)
        {
            var entity = await _stopRequestRepository.GetByIdAsync(id);
            if (entity == null) return;

            if (!string.IsNullOrEmpty(dto.StopName)) entity.StopName = dto.StopName;
            if (dto.Address != null) entity.Address = dto.Address;
            if (dto.Latitude.HasValue) entity.Latitude = dto.Latitude.Value;
            if (dto.Longitude.HasValue) entity.Longitude = dto.Longitude.Value;
            if (dto.OperatorNote != null) entity.OperatorNote = dto.OperatorNote;
            if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive;
            if (!string.IsNullOrEmpty(dto.Status)) entity.Status = dto.Status;

            _stopRequestRepository.Update(entity);
            await _stopRequestRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _stopRequestRepository.GetByIdAsync(id);
            if (entity != null)
            {
                _stopRequestRepository.Remove(entity);
                await _stopRequestRepository.SaveChangesAsync();
            }
        }

        private StopRequestDto MapToDto(Tblstop entity)
        {
            var firstRouteStop = entity.TblrouteStops?.FirstOrDefault();
            return new StopRequestDto
            {
                StopId = entity.Id,
                ClientId = entity.ClientId,
                StopName = entity.StopName,
                Address = entity.Address,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                Status = entity.Status,
                OperatorNote = entity.OperatorNote,
                IsActive = entity.IsActive,
                RouteId = firstRouteStop?.RouteId,
                RouteName = firstRouteStop?.Route?.RouteName
            };
        }
    }
}
