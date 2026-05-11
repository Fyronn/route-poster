using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Trips;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface ITripService
    {
        Task<IEnumerable<TripDto>> GetAllAsync();
        Task<IEnumerable<TripDto>> GetByRouteIdAsync(int routeId);
        Task<TripDto> CreateAsync(CreateTripDto dto);
    }
}
