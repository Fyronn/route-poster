using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class TripRepository : GenericRepository<TblSeferler>, ITripRepository
    {
        public TripRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
