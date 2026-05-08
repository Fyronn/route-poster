using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class VehicleRepository : GenericRepository<TblAraclar>, IVehicleRepository
    {
        public VehicleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
