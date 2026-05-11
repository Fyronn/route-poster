using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class RouteRequestRepository : GenericRepository<TblRotalar>, IRouteRequestRepository
    {
        public RouteRequestRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
