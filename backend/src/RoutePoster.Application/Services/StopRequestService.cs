using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Stops;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

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
            var entities = await _stopRequestRepository.FindAsync(s => s.KurumId == clientId);
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
            var entity = new TblDuraklar
            {
                KurumId = dto.KurumId,
                DurakAdi = dto.DurakAdi ?? string.Empty,
                Adres = dto.Adres,
                Enlem = dto.Enlem,
                Boylam = dto.Boylam,
                OperatorNotu = dto.OperatorNotu,
                Statu = "Talep Edildi",
                AktifMi = true
            };

            await _stopRequestRepository.AddAsync(entity);
            await _stopRequestRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        private StopRequestDto MapToDto(TblDuraklar entity)
        {
            return new StopRequestDto
            {
                DurakId = entity.DurakId,
                KurumId = entity.KurumId,
                DurakAdi = entity.DurakAdi,
                Adres = entity.Adres,
                Enlem = entity.Enlem,
                Boylam = entity.Boylam,
                Statu = entity.Statu,
                OperatorNotu = entity.OperatorNotu,
                AktifMi = entity.AktifMi
            };
        }
    }
}
