using RoutePoster.Domain.Entities;

namespace RoutePoster.Domain.Interfaces;

public interface IPassengerPreferenceRepository : IGenericRepository<TblpassengerRoutePreference>
{
}

public interface IPassengerTemporaryPreferenceRepository : IGenericRepository<TblpassengerTemporaryPreference>
{
}
