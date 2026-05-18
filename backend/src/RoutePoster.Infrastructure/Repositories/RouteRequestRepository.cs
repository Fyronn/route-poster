using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class RouteRequestRepository : GenericRepository<Tblroute>, IRouteRequestRepository
    {
        public RouteRequestRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Tblroute>> GetAllWithDetailsAsync()
        {
            return await _context.Tblroutes
                .Include(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
                .Include(r => r.TblpassengerRoutePreferences).ThenInclude(pr => pr.Passenger)
                .ToListAsync();
        }

        public async Task<IEnumerable<Tblroute>> GetByClientIdWithDetailsAsync(int clientId)
        {
            return await _context.Tblroutes
                .Where(r => r.ClientId == clientId)
                .Include(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
                .Include(r => r.TblpassengerRoutePreferences).ThenInclude(pr => pr.Passenger)
                .ToListAsync();
        }
    }
}
