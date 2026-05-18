using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class TripAttendanceRepository : GenericRepository<TbltripAttendance>, ITripAttendanceRepository
    {
        public TripAttendanceRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
