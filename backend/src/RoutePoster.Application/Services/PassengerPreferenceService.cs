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
    private readonly IPassengerAbsenceRepository _absenceRepo;

    public PassengerPreferenceService(
        IPassengerPreferenceRepository preferenceRepo, 
        IPassengerTemporaryPreferenceRepository tempPreferenceRepo,
        IPassengerAbsenceRepository absenceRepo)
    {
        _preferenceRepo = preferenceRepo;
        _tempPreferenceRepo = tempPreferenceRepo;
        _absenceRepo = absenceRepo;
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
            DropoffStopId = p.DropoffStopId,
            DropoffStopName = p.DropoffStop?.StopName,
            IsTemporary = false
        });

        var tempPrefs = tempEntities.Select(p => new PassengerPreferenceDto
        {
            Id = p.Id,
            RouteId = p.RouteId,
            RouteName = p.Route.RouteName,
            PickupStopId = p.PickupStopId,
            PickupStopName = p.PickupStop.StopName,
            DropoffStopId = p.DropoffStopId,
            DropoffStopName = p.DropoffStop?.StopName,
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
                DropoffStopId = temp.DropoffStopId,
                DropoffStopName = temp.DropoffStop?.StopName,
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
                DropoffStopId = def.DropoffStopId,
                DropoffStopName = def.DropoffStop?.StopName,
                IsTemporary = false
            };
        }

        return null;
    }

    public async Task<DailyStatusDto> GetDailyStatusAsync(int passengerId, DateOnly date)
    {
        var isAbsent = await _absenceRepo.IsAbsentAsync(passengerId, date);
        var pref = await GetEffectivePreferenceAsync(passengerId, date);

        return new DailyStatusDto
        {
            IsAbsent = isAbsent,
            Preference = pref
        };
    }

    public async Task AddAbsenceRangeAsync(CreateAbsenceDto dto)
    {
        var currentDate = dto.StartDate;
        while (currentDate <= dto.EndDate)
        {
            var alreadyExists = await _absenceRepo.IsAbsentAsync(dto.PassengerId, currentDate);
            if (!alreadyExists)
            {
                await _absenceRepo.AddAsync(new TblpassengerAbsence
                {
                    PassengerId = dto.PassengerId,
                    RouteId = dto.RouteId,
                    AbsenceDate = currentDate,
                    Description = dto.Reason,
                    CreatedAt = DateTime.UtcNow
                });
            }
            currentDate = currentDate.AddDays(1);
        }
        await _absenceRepo.SaveChangesAsync();
    }

    public async Task SetDefaultPreferenceAsync(int passengerId, int routeId, int pickupStopId, int? dropoffStopId)
    {
        var existingList = await _preferenceRepo.FindAsync(p => p.PassengerId == passengerId && p.RouteId == routeId);
        var existing = existingList.FirstOrDefault();

        if (existing != null)
        {
            existing.PickupStopId = pickupStopId;
            existing.DropoffStopId = dropoffStopId;
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
                PickupStopId = pickupStopId,
                DropoffStopId = dropoffStopId,
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
            DropoffStopId = dto.DropoffStopId,
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
