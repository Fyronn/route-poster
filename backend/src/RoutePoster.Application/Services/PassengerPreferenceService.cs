using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Infrastructure;

namespace RoutePoster.Application.Services;

public class PassengerPreferenceService : IPassengerPreferenceService
{
    private readonly ApplicationDbContext _context;

    public PassengerPreferenceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PassengerPreferenceDto>> GetPreferencesAsync(int passengerId)
    {
        var defaultPrefs = await _context.TblpassengerRoutePreferences
            .Include(p => p.Route)
            .Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId)
            .Select(p => new PassengerPreferenceDto
            {
                Id = p.Id,
                RouteId = p.RouteId,
                RouteName = p.Route.RouteName,
                PickupStopId = p.PickupStopId,
                PickupStopName = p.PickupStop.StopName,
                IsTemporary = false
            })
            .ToListAsync();

        var tempPrefs = await _context.TblpassengerTemporaryPreferences
            .Include(p => p.Route)
            .Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true))
            .Select(p => new PassengerPreferenceDto
            {
                Id = p.Id,
                RouteId = p.RouteId,
                RouteName = p.Route.RouteName,
                PickupStopId = p.PickupStopId,
                PickupStopName = p.PickupStop.StopName,
                IsTemporary = true,
                StartDate = p.StartDate,
                EndDate = p.EndDate
            })
            .ToListAsync();

        return defaultPrefs.Concat(tempPrefs);
    }

    public async Task<PassengerPreferenceDto?> GetEffectivePreferenceAsync(int passengerId, DateOnly date)
    {
        // 1. Check temporary preferences
        var temp = await _context.TblpassengerTemporaryPreferences
            .Include(p => p.Route)
            .Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId && (p.IsActive ?? true) && date >= p.StartDate && date <= p.EndDate)
            .FirstOrDefaultAsync();

        if (temp != null)
        {
            return new PassengerPreferenceDto
            {
                Id = temp.Id,
                RouteId = temp.RouteId,
                RouteName = temp.Route.RouteName,
                PickupStopId = temp.PickupStopId,
                PickupStopName = temp.PickupStop.StopName,
                IsTemporary = true,
                StartDate = temp.StartDate,
                EndDate = temp.EndDate
            };
        }

        // 2. Fallback to default
        var def = await _context.TblpassengerRoutePreferences
            .Include(p => p.Route)
            .Include(p => p.PickupStop)
            .Where(p => p.PassengerId == passengerId && (p.IsDefault ?? false))
            .FirstOrDefaultAsync();

        if (def != null)
        {
            return new PassengerPreferenceDto
            {
                Id = def.Id,
                RouteId = def.RouteId,
                RouteName = def.Route.RouteName,
                PickupStopId = def.PickupStopId,
                PickupStopName = def.PickupStop.StopName,
                IsTemporary = false
            };
        }

        return null;
    }

    public async Task SetDefaultPreferenceAsync(int passengerId, int routeId, int stopId)
    {
        var existing = await _context.TblpassengerRoutePreferences
            .Where(p => p.PassengerId == passengerId && p.RouteId == routeId)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            existing.PickupStopId = stopId;
            existing.IsDefault = true;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            await _context.TblpassengerRoutePreferences.AddAsync(new TblpassengerRoutePreference
            {
                PassengerId = passengerId,
                RouteId = routeId,
                PickupStopId = stopId,
                IsDefault = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task AddTemporaryPreferenceAsync(int passengerId, CreateTemporaryPreferenceDto dto)
    {
        var entity = new TblpassengerTemporaryPreference
        {
            PassengerId = passengerId,
            RouteId = dto.RouteId,
            PickupStopId = dto.PickupStopId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.TblpassengerTemporaryPreferences.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
}
