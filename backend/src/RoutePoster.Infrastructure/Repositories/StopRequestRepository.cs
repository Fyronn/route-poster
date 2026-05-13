using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class StopRequestRepository : GenericRepository<Tblstop>, IStopRequestRepository
    {
        public StopRequestRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
