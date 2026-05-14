using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories;

public class PassengerPreferenceRepository : GenericRepository<TblpassengerRoutePreference>, IPassengerPreferenceRepository
{
    public PassengerPreferenceRepository(ApplicationDbContext context) : base(context)
    {
    }
}

public class PassengerTemporaryPreferenceRepository : GenericRepository<TblpassengerTemporaryPreference>, IPassengerTemporaryPreferenceRepository
{
    public PassengerTemporaryPreferenceRepository(ApplicationDbContext context) : base(context)
    {
    }
}
