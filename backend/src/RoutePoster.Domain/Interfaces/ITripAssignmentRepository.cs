using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Domain.Entities;

namespace RoutePoster.Domain.Interfaces
{
    public interface ITripAssignmentRepository : IGenericRepository<TbltripAssignment>
    {
        Task<IEnumerable<TbltripAssignment>> GetAllWithDetailsAsync();
        Task<TbltripAssignment?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<TbltripAssignment>> GetPlannedAssignmentsByDriverIdAsync(int driverId);
    }
}
