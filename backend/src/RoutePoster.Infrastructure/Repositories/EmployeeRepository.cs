using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories
{
    public class EmployeeRepository : GenericRepository<TblKullanicilar>, IEmployeeRepository
    {
        public EmployeeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
