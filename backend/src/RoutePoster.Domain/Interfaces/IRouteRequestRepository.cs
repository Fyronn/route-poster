using RoutePoster.Domain.Entities;

namespace RoutePoster.Domain.Interfaces
{
    public interface IRouteRequestRepository : IGenericRepository<Tblroute>
    {
        Task<IEnumerable<Tblroute>> GetAllWithDetailsAsync();
        Task<IEnumerable<Tblroute>> GetByClientIdWithDetailsAsync(int clientId);
    }
}
