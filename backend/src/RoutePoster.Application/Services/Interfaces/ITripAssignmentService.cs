using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.TripAssignments;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface ITripAssignmentService
    {
        Task<IEnumerable<TripAssignmentDto>> GetAllAsync();
        Task<TripAssignmentDto?> GetByIdAsync(int id);
        Task<TripAssignmentDto> CreateAsync(CreateTripAssignmentDto dto);
        Task UpdateAsync(int id, UpdateTripAssignmentDto dto);
        Task DeleteAsync(int id);
    }
}
