using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IRouteRequestService
    {
        Task<IEnumerable<RouteRequestDto>> GetAllAsync();
        Task<IEnumerable<RouteRequestDto>> GetByKurumIdAsync(int kurumId);
        Task<IEnumerable<RouteRequestDto>> GetByClientIdAsync(int clientId);
        Task<IEnumerable<RouteRequestDto>> GetApprovedByClientIdAsync(int clientId);
        Task<RouteRequestDto?> GetByIdAsync(int id);
        Task<RouteRequestDto> CreateAsync(CreateRouteRequestDto dto);
        Task UpdateStatusAsync(int id, string status);
    }
}
