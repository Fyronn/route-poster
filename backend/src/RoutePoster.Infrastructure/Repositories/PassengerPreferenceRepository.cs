using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Infrastructure.Repositories;

public class PassengerPreferenceRepository : GenericRepository<TblpassengerRoutePreference>, IPassengerPreferenceRepository
{
    public PassengerPreferenceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<TblpassengerRoutePreference>> GetWithDetailsByPassengerIdAsync(int passengerId)
    {
        return await _dbSet
            .Include(p => p.Route).ThenInclude(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
            .Include(p => p.PickupStop)
            .Include(p => p.DropoffStop)
            .Where(p => p.PassengerId == passengerId).ToListAsync();
    }

    public async Task<TblpassengerRoutePreference?> GetDefaultWithDetailsAsync(int passengerId)
    {
        return await _dbSet
            .Include(p => p.Route).ThenInclude(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
            .Include(p => p.PickupStop)
            .Include(p => p.DropoffStop)
            .FirstOrDefaultAsync(p => p.PassengerId == passengerId && (p.IsDefault ?? false));
    }

    public async Task<TblpassengerRoutePreference?> GetDefaultWithDetailsByRouteAsync(int passengerId, int routeId)
    {
        return await _dbSet
            .Include(p => p.Route).ThenInclude(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
            .Include(p => p.PickupStop)
            .Include(p => p.DropoffStop)
            .FirstOrDefaultAsync(p => p.PassengerId == passengerId && p.RouteId == routeId && (p.IsDefault ?? false));
    }
}

public class PassengerTemporaryPreferenceRepository : GenericRepository<TblpassengerTemporaryPreference>, IPassengerTemporaryPreferenceRepository
{
    public PassengerTemporaryPreferenceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<TblpassengerTemporaryPreference>> GetActiveWithDetailsByPassengerIdAsync(int passengerId)
    {
        return await _dbSet
            .Include(p => p.Route).ThenInclude(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
            .Include(p => p.PickupStop)
            .Include(p => p.DropoffStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true)).ToListAsync();
    }

    public async Task<TblpassengerTemporaryPreference?> GetEffectiveAsync(int passengerId, DateOnly date)
    {
        return await _dbSet
            .Include(p => p.Route).ThenInclude(r => r.TblrouteStops).ThenInclude(rs => rs.Stop)
            .Include(p => p.PickupStop)
            .Include(p => p.DropoffStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true) && date >= p.StartDate && date <= p.EndDate)
            .FirstOrDefaultAsync();
    }
}

public class PassengerAbsenceRepository : GenericRepository<TblpassengerAbsence>, IPassengerAbsenceRepository
{
    public PassengerAbsenceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<TblpassengerAbsence>> GetByPassengerIdAsync(int passengerId)
    {
        return await _dbSet.Where(p => p.PassengerId == passengerId).ToListAsync();
    }

    public async Task<IEnumerable<TblpassengerAbsence>> GetWithDetailsByPassengerIdAsync(int passengerId)
    {
        return await _dbSet.Include(p => p.Route).Where(p => p.PassengerId == passengerId).ToListAsync();
    }

    public async Task<bool> IsAbsentAsync(int passengerId, DateOnly date)
    {
        return await _dbSet.AnyAsync(p => p.PassengerId == passengerId && p.AbsenceDate == date);
    }
}
