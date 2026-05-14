using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services;

public class PassengerPreferenceService : IPassengerPreferenceService
{
    private readonly IPassengerPreferenceRepository _preferenceRepo;
    private readonly IPassengerTemporaryPreferenceRepository _tempPreferenceRepo;

    public PassengerPreferenceService(
        IPassengerPreferenceRepository preferenceRepo, 
        IPassengerTemporaryPreferenceRepository tempPreferenceRepo)
    {
        _preferenceRepo = preferenceRepo;
        _tempPreferenceRepo = tempPreferenceRepo;
    }

    public async Task<IEnumerable<PassengerPreferenceDto>> GetPreferencesAsync(int passengerId)
    {
        var defaultEntities = await _preferenceRepo.GetWithDetailsByPassengerIdAsync(passengerId);
        var tempEntities = await _tempPreferenceRepo.GetActiveWithDetailsByPassengerIdAsync(passengerId);

        var defaultPrefs = defaultEntities.Select(p => new PassengerPreferenceDto
        {
            Id = p.Id,
            RouteId = p.RouteId,
            RouteName = p.Route.RouteName,
            PickupStopId = p.PickupStopId,
            PickupStopName = p.PickupStop.StopName,
            IsTemporary = false
        });

        var tempPrefs = tempEntities.Select(p => new PassengerPreferenceDto
        {
            Id = p.Id,
            RouteId = p.RouteId,
            RouteName = p.Route.RouteName,
            PickupStopId = p.PickupStopId,
            PickupStopName = p.PickupStop.StopName,
            IsTemporary = true,
            StartDate = p.StartDate,
            EndDate = p.EndDate
        });

        return defaultPrefs.Concat(tempPrefs);
    }

    public async Task<PassengerPreferenceDto?> GetEffectivePreferenceAsync(int passengerId, DateOnly date)
    {
        var temp = await _tempPreferenceRepo.GetEffectiveAsync(passengerId, date);
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

        var def = await _preferenceRepo.GetDefaultWithDetailsAsync(passengerId);
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
        var existingList = await _preferenceRepo.FindAsync(p => p.PassengerId == passengerId && p.RouteId == routeId);
        var existing = existingList.FirstOrDefault();

        if (existing != null)
        {
            existing.PickupStopId = stopId;
            existing.IsDefault = true;
            existing.UpdatedAt = DateTime.UtcNow;
            _preferenceRepo.Update(existing);
        }
        else
        {
            await _preferenceRepo.AddAsync(new TblpassengerRoutePreference
            {
                PassengerId = passengerId,
                RouteId = routeId,
                PickupStopId = stopId,
                IsDefault = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _preferenceRepo.SaveChangesAsync();
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

        await _tempPreferenceRepo.AddAsync(entity);
        await _tempPreferenceRepo.SaveChangesAsync();
    }
}
