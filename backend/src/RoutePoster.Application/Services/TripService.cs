using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Trips;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

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

        public async Task<IEnumerable<TripDto>> GetByKurumIdAsync(int kurumId)
        {
            var entities = await _tripRepository.FindAsync(t => t.Rota != null && t.Rota.KurumId == kurumId);
            return entities.Select(MapToDto);
        }
        
        public async Task<IEnumerable<TripDto>> GetByRouteIdAsync(int routeId)
        {
            var entities = await _tripRepository.FindAsync(t => t.RotaId == routeId);
            return entities.Select(MapToDto);
        }

        public async Task<TripDto> CreateAsync(CreateTripDto dto)
        {
            var entity = new TblSeferler
            {
                RotaId = dto.RotaId,
                SeferTarihi = dto.SeferTarihi,
                BaslamaZamani = dto.BaslamaZamani,
                BitisZamani = dto.BitisZamani,
                Statu = "Planlandı"
            };

            await _tripRepository.AddAsync(entity);
            await _tripRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        private TripDto MapToDto(TblSeferler entity)
        {
            return new TripDto
            {
                SeferId = entity.SeferId,
                RotaId = entity.RotaId,
                SeferTarihi = entity.SeferTarihi,
                BaslamaZamani = entity.BaslamaZamani,
                BitisZamani = entity.BitisZamani,
                Statu = entity.Statu
            };
        }
    }
}
