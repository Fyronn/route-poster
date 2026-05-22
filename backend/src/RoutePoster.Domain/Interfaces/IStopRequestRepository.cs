using RoutePoster.Domain.Entities;

namespace RoutePoster.Domain.Interfaces
{
    public interface IStopRequestRepository : IGenericRepository<Tblstop>
    {
        System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Tblstop>> GetWithRoutesByClientIdAsync(int clientId);
    }
}
