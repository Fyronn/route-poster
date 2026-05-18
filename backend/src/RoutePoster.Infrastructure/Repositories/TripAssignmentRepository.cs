using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class TripAssignmentRepository : GenericRepository<TbltripAssignment>, ITripAssignmentRepository
    {
        public TripAssignmentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TbltripAssignment>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(x => x.Trip)
                .Include(x => x.Vehicle)
                .Include(x => x.Driver)
                .ToListAsync();
        }

        public async Task<TbltripAssignment?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(x => x.Trip)
                .Include(x => x.Vehicle)
                .Include(x => x.Driver)
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
