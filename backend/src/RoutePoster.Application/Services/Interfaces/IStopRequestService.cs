using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Stops;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IStopRequestService
    {
        Task<IEnumerable<StopRequestDto>> GetByKurumIdAsync(int kurumId);
        Task<IEnumerable<StopRequestDto>> GetByClientIdAsync(int clientId);
        Task<StopRequestDto?> GetByIdAsync(int id);
        Task<StopRequestDto> CreateAsync(CreateStopRequestDto dto);
    }
}
