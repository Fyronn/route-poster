using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Drivers;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IDriverService
    {
        Task<IEnumerable<DriverDto>> GetAllAsync();
        Task<DriverDto?> GetByIdAsync(int id);
        Task<DriverDto> CreateAsync(CreateDriverDto dto);
        Task UpdateAsync(int id, UpdateDriverDto dto);
        Task DeleteAsync(int id);
        Task<IEnumerable<DriverPlannedTripDto>> GetPlannedTripsForDriverAsync(int driverId);
        Task<IEnumerable<DriverAssignedTripDto>> GetAssignedTripsForDriverAsync(int driverId, string? status = null);
    }
}
