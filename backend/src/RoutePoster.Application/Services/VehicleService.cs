using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Vehicles;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

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
            var entity = new Tblvehicle
            {
                TransportCompanyId = dto.TransportCompanyId ?? 1,
                PlateNumber = dto.PlateNumber,
                Capacity = dto.Capacity,
                BrandModel = dto.BrandModel,
                ProductionYear = dto.ProductionYear,
                VehicleType = dto.VehicleType,
                EquipmentFeatures = dto.EquipmentFeatures,
                IsActive = dto.IsActive ?? true
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
                entity.PlateNumber = dto.PlateNumber;
                entity.Capacity = dto.Capacity;
                entity.BrandModel = dto.BrandModel;
                entity.ProductionYear = dto.ProductionYear;
                entity.VehicleType = dto.VehicleType;
                entity.EquipmentFeatures = dto.EquipmentFeatures;
                entity.IsActive = dto.IsActive;

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

        private VehicleDto MapToDto(Tblvehicle entity)
        {
            return new VehicleDto
            {
                VehicleId = entity.Id,
                TransportCompanyId = entity.TransportCompanyId,
                PlateNumber = entity.PlateNumber,
                Capacity = entity.Capacity,
                BrandModel = entity.BrandModel,
                ProductionYear = entity.ProductionYear,
                VehicleType = entity.VehicleType,
                EquipmentFeatures = entity.EquipmentFeatures,
                IsActive = entity.IsActive
            };
        }
    }
}
