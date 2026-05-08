using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Vehicles;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllAsync();
        Task<VehicleDto?> GetByIdAsync(int id);
        Task<VehicleDto> CreateAsync(CreateVehicleDto dto);
        Task UpdateAsync(int id, UpdateVehicleDto dto);
        Task DeleteAsync(int id);
    }
}
