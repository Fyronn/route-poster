using Microsoft.EntityFrameworkCore;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;
using System.Linq;

namespace RoutePoster.Infrastructure.Repositories
{
    public class StopRequestRepository : GenericRepository<Tblstop>, IStopRequestRepository
    {
        public StopRequestRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Tblstop>> GetWithRoutesByClientIdAsync(int clientId)
        {
            return await _dbSet
                .Include(s => s.TblrouteStops)
                    .ThenInclude(rs => rs.Route)
                .Where(s => s.ClientId == clientId)
                .ToListAsync();
        }
    }
}
