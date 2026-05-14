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
        return await _dbSet.Include(p => p.Route).Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId).ToListAsync();
    }

    public async Task<TblpassengerRoutePreference?> GetDefaultWithDetailsAsync(int passengerId)
    {
        return await _dbSet.Include(p => p.Route).Include(p => p.PickupStop)
            .FirstOrDefaultAsync(p => p.PassengerId == passengerId && (p.IsDefault ?? false));
    }
}

public class PassengerTemporaryPreferenceRepository : GenericRepository<TblpassengerTemporaryPreference>, IPassengerTemporaryPreferenceRepository
{
    public PassengerTemporaryPreferenceRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<TblpassengerTemporaryPreference>> GetActiveWithDetailsByPassengerIdAsync(int passengerId)
    {
        return await _dbSet.Include(p => p.Route).Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true)).ToListAsync();
    }

    public async Task<TblpassengerTemporaryPreference?> GetEffectiveAsync(int passengerId, DateOnly date)
    {
        return await _dbSet.Include(p => p.Route).Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true) && date >= p.StartDate && date <= p.EndDate)
            .FirstOrDefaultAsync();
    }
}
