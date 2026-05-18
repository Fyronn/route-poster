using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
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

    public async Task<IEnumerable<PassengerAbsenceDto>> GetAbsencesAsync(int passengerId)
    {
        var absences = await _absenceRepo.GetWithDetailsByPassengerIdAsync(passengerId);
        return absences.Select(a => new PassengerAbsenceDto
        {
            Id = a.Id,
            RouteId = a.RouteId,
            RouteName = a.Route?.RouteName ?? "Unknown",
            AbsenceDate = a.AbsenceDate,
            Description = a.Description
        }).OrderByDescending(a => a.AbsenceDate);
    }

    public async Task<IEnumerable<PassengerPreferenceDto>> GetTemporaryPreferencesAsync(int passengerId)
    {
        var tempEntities = await _tempPreferenceRepo.GetActiveWithDetailsByPassengerIdAsync(passengerId);
        return tempEntities.Select(p => new PassengerPreferenceDto
        {
            Id = p.Id,
            RouteId = p.RouteId,
            RouteName = p.Route.RouteName,
            PickupStopId = p.PickupStopId,
            PickupStopName = p.PickupStop.StopName,
            PickupStopAddress = p.PickupStop.Address,
            DropoffStopId = p.DropoffStopId,
            DropoffStopName = p.DropoffStop?.StopName,
            DropoffStopAddress = p.DropoffStop?.Address,
            IsTemporary = true,
            StartDate = p.StartDate,
            EndDate = p.EndDate
        }).OrderByDescending(p => p.StartDate);
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
                PickupStopAddress = temp.PickupStop.Address,
                DropoffStopId = temp.DropoffStopId,
                DropoffStopName = temp.DropoffStop?.StopName,
                DropoffStopAddress = temp.DropoffStop?.Address,
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
                PickupStopAddress = def.PickupStop.Address,
                DropoffStopId = def.DropoffStopId,
                DropoffStopName = def.DropoffStop?.StopName,
                DropoffStopAddress = def.DropoffStop?.Address,
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
        int pickupStopId = dto.PickupStopId ?? 0;
        int? dropoffStopId = dto.DropoffStopId;

        // If either pickup or dropoff stop is not provided, try to fallback to the default preference
        if (dto.PickupStopId == null || dto.DropoffStopId == null)
        {
            var defaultPref = await _preferenceRepo.GetDefaultWithDetailsAsync(passengerId);
            if (defaultPref != null)
            {
                if (dto.PickupStopId == null)
                {
                    pickupStopId = defaultPref.PickupStopId;
                }
                if (dto.DropoffStopId == null)
                {
                    dropoffStopId = defaultPref.DropoffStopId;
                }
            }
        }

        if (pickupStopId == 0)
        {
            throw new System.ArgumentException("A pickup stop must be provided either as a parameter or exist as a default preference.");
        }

        var entity = new TblpassengerTemporaryPreference
        {
            PassengerId = passengerId,
            RouteId = dto.RouteId,
            PickupStopId = pickupStopId,
            DropoffStopId = dropoffStopId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _tempPreferenceRepo.AddAsync(entity);
        await _tempPreferenceRepo.SaveChangesAsync();
    }

    public async Task<IEnumerable<RouteRequestDto>> GetPassengerRoutesAsync(int passengerId)
    {
        var preferences = await _preferenceRepo.GetWithDetailsByPassengerIdAsync(passengerId);
        
        // Sadece aktif rotaları alalım
        var activeRoutes = preferences
            .Select(p => p.Route)
            .Where(r => r != null && r.IsActive == true)
            .DistinctBy(r => r.Id);

        return activeRoutes.Select(r => new RouteRequestDto
        {
            RouteId = r.Id,
            ClientId = r.ClientId,
            RouteName = r.RouteName,
            Status = r.Status,
            ShiftType = r.ShiftType,
            Direction = r.Direction,
            OperatingDays = r.OperatingDays,
            PlannedStartTime = r.PlannedStartTime,
            EstimatedDurationMinutes = r.EstimatedDurationMinutes,
            IsActive = r.IsActive,
            // Detaylı durak ve yolcu listesi istenirse buraya eklenebilir
            // Şu an temel rota bilgilerini dönüyoruz
        });
    }
}
