using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class ClientRepository : GenericRepository<TblMusteriKurumlar>, IClientRepository
    {
        public ClientRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
