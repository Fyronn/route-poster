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
            var entities = await _stopRequestRepository.FindAsync(s => s.ClientId == clientId);
            return entities.Select(MapToDto);
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

        private StopRequestDto MapToDto(Tblstop entity)
        {
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
                IsActive = entity.IsActive
            };
        }
    }
}
