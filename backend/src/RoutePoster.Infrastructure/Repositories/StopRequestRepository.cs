using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class StopRequestRepository : GenericRepository<TblDuraklar>, IStopRequestRepository
    {
        public StopRequestRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
