using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class TripRepository : GenericRepository<Tbltrip>, ITripRepository
    {
        public TripRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
