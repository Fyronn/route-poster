using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class RouteRequestRepository : GenericRepository<Tblroute>, IRouteRequestRepository
    {
        public RouteRequestRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
