using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.TripAttendances;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface ITripAttendanceService
    {
        Task<IEnumerable<TripAttendanceDto>> GetAllAsync();
        Task<TripAttendanceDto?> GetByIdAsync(int id);
        Task<TripAttendanceDto> CreateAsync(CreateTripAttendanceDto dto);
        Task UpdateAsync(int id, UpdateTripAttendanceDto dto);
        Task DeleteAsync(int id);
    }
}
