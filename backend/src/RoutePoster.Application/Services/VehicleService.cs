using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Vehicles;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

namespace RoutePoster.Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;

        public VehicleService(IVehicleRepository vehicleRepository)
        {
            _vehicleRepository = vehicleRepository;
        }

        public async Task<IEnumerable<VehicleDto>> GetAllAsync()
        {
            var entities = await _vehicleRepository.GetAllAsync();
            return entities.Select(MapToDto);
        }

        public async Task<VehicleDto?> GetByIdAsync(int id)
        {
            var entity = await _vehicleRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<VehicleDto> CreateAsync(CreateVehicleDto dto)
        {
            var entity = new TblAraclar
            {
                TurizmFirmaId = dto.TurizmFirmaId,
                Plaka = dto.Plaka,
                Kapasite = dto.Kapasite,
                MarkaModel = dto.MarkaModel,
                UretimYili = dto.UretimYili,
                AracTipi = dto.AracTipi,
                DonanimOzellikleri = dto.DonanimOzellikleri,
                AktifMi = dto.AktifMi ?? true
            };

            await _vehicleRepository.AddAsync(entity);
            await _vehicleRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateAsync(int id, UpdateVehicleDto dto)
        {
            var entity = await _vehicleRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.Plaka = dto.Plaka;
                entity.Kapasite = dto.Kapasite;
                entity.MarkaModel = dto.MarkaModel;
                entity.UretimYili = dto.UretimYili;
                entity.AracTipi = dto.AracTipi;
                entity.DonanimOzellikleri = dto.DonanimOzellikleri;
                entity.AktifMi = dto.AktifMi;

                _vehicleRepository.Update(entity);
                await _vehicleRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _vehicleRepository.GetByIdAsync(id);
            if (entity != null)
            {
                _vehicleRepository.Remove(entity);
                await _vehicleRepository.SaveChangesAsync();
            }
        }

        private VehicleDto MapToDto(TblAraclar entity)
        {
            return new VehicleDto
            {
                AracId = entity.AracId,
                TurizmFirmaId = entity.TurizmFirmaId,
                Plaka = entity.Plaka,
                Kapasite = entity.Kapasite,
                MarkaModel = entity.MarkaModel,
                UretimYili = entity.UretimYili,
                AracTipi = entity.AracTipi,
                DonanimOzellikleri = entity.DonanimOzellikleri,
                AktifMi = entity.AktifMi
            };
        }
    }
}
