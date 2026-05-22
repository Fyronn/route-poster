using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Domain.Entities;

namespace RoutePoster.Domain.Interfaces;

public interface IPassengerPreferenceRepository : IGenericRepository<TblpassengerRoutePreference>
{
    Task<IEnumerable<TblpassengerRoutePreference>> GetWithDetailsByPassengerIdAsync(int passengerId);
    Task<TblpassengerRoutePreference?> GetDefaultWithDetailsAsync(int passengerId);
    Task<TblpassengerRoutePreference?> GetDefaultWithDetailsByRouteAsync(int passengerId, int routeId);
}

public interface IPassengerTemporaryPreferenceRepository : IGenericRepository<TblpassengerTemporaryPreference>
{
    Task<IEnumerable<TblpassengerTemporaryPreference>> GetActiveWithDetailsByPassengerIdAsync(int passengerId);
    Task<TblpassengerTemporaryPreference?> GetEffectiveAsync(int passengerId, DateOnly date);
}

public interface IPassengerAbsenceRepository : IGenericRepository<TblpassengerAbsence>
{
    Task<IEnumerable<TblpassengerAbsence>> GetByPassengerIdAsync(int passengerId);
    Task<IEnumerable<TblpassengerAbsence>> GetWithDetailsByPassengerIdAsync(int passengerId);
    Task<bool> IsAbsentAsync(int passengerId, DateOnly date);
}
