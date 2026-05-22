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
            PickupStopName = p.PickupStop?.StopName,
            PickupStopAddress = p.PickupStop?.Address,
            DropoffStopId = p.DropoffStopId,
            DropoffStopName = p.DropoffStop?.StopName,
            DropoffStopAddress = p.DropoffStop?.Address,
            IsTemporary = true,
            StartDate = p.StartDate,
            EndDate = p.EndDate
        }).OrderByDescending(p => p.StartDate);
    }

    public async Task<IEnumerable<PassengerPreferenceDto>> GetEffectivePreferenceAsync(int passengerId, DateOnly date)
    {
        var resultList = new List<PassengerPreferenceDto>();

        // 1. Fetch all default preferences
        var defaults = await _preferenceRepo.GetWithDetailsByPassengerIdAsync(passengerId);
        var defaultPrefs = defaults.Where(p => p.IsDefault ?? true).ToList();

        // 2. Fetch all active temporary preferences
        var temps = await _tempPreferenceRepo.GetActiveWithDetailsByPassengerIdAsync(passengerId);
        var activeTemps = temps.Where(p => date >= p.StartDate && date <= p.EndDate)
                               .OrderByDescending(p => p.CreatedAt ?? DateTime.MinValue)
                               .ToList();

        // 3. Keep track of route IDs we processed
        var processedRouteIds = new HashSet<int>();

        // 4. Match and map
        foreach (var temp in activeTemps)
        {
            if (!processedRouteIds.Add(temp.RouteId))
            {
                continue; // Skip older overlapping records
            }

            resultList.Add(new PassengerPreferenceDto
            {
                Id = temp.Id,
                RouteId = temp.RouteId,
                RouteName = temp.Route?.RouteName ?? "Unknown",
                PickupStopId = temp.PickupStopId,
                PickupStopName = temp.PickupStop?.StopName,
                PickupStopAddress = temp.PickupStop?.Address,
                DropoffStopId = temp.DropoffStopId,
                DropoffStopName = temp.DropoffStop?.StopName,
                DropoffStopAddress = temp.DropoffStop?.Address,
                LastStopName = temp.Route?.TblrouteStops?.OrderByDescending(rs => rs.StopOrder).FirstOrDefault()?.Stop?.StopName,
                IsTemporary = true,
                StartDate = temp.StartDate,
                EndDate = temp.EndDate,
                Stops = temp.Route?.TblrouteStops?
                    .Select(rs => new RouteStopDto
                    {
                        StopId = rs.StopId,
                        StopName = rs.Stop?.StopName ?? "Unknown",
                        StopOrder = rs.StopOrder
                    }).OrderBy(rs => rs.StopOrder).ToList() ?? new()
            });
        }

        foreach (var def in defaultPrefs)
        {
            if (processedRouteIds.Contains(def.RouteId))
            {
                continue; // Already processed via temporary preference override
            }

            resultList.Add(new PassengerPreferenceDto
            {
                Id = def.Id,
                RouteId = def.RouteId,
                RouteName = def.Route?.RouteName ?? "Unknown",
                PickupStopId = def.PickupStopId,
                PickupStopName = def.PickupStop?.StopName,
                PickupStopAddress = def.PickupStop?.Address,
                DropoffStopId = def.DropoffStopId,
                DropoffStopName = def.DropoffStop?.StopName,
                DropoffStopAddress = def.DropoffStop?.Address,
                LastStopName = def.Route?.TblrouteStops?.OrderByDescending(rs => rs.StopOrder).FirstOrDefault()?.Stop?.StopName,
                IsTemporary = false,
                Stops = def.Route?.TblrouteStops?
                    .Select(rs => new RouteStopDto
                    {
                        StopId = rs.StopId,
                        StopName = rs.Stop?.StopName ?? "Unknown",
                        StopOrder = rs.StopOrder
                    }).OrderBy(rs => rs.StopOrder).ToList() ?? new()
            });
        }

        return resultList;
    }

    public async Task<PassengerPreferenceDto?> GetDefaultPreferenceAsync(int passengerId, int routeId)
    {
        var def = await _preferenceRepo.GetDefaultWithDetailsByRouteAsync(passengerId, routeId);
        if (def != null)
        {
            return new PassengerPreferenceDto
            {
                Id = def.Id,
                RouteId = def.RouteId,
                RouteName = def.Route.RouteName,
                PickupStopId = def.PickupStopId,
                PickupStopName = def.PickupStop?.StopName,
                PickupStopAddress = def.PickupStop?.Address,
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
        var prefs = (await GetEffectivePreferenceAsync(passengerId, date)).ToList();

        return new DailyStatusDto
        {
            IsAbsent = isAbsent,
            Preference = prefs.FirstOrDefault(),
            Preferences = prefs
        };
    }

    public async Task AddAbsenceRangeAsync(CreateAbsenceDto dto)
    {
        var currentDate = dto.StartDate;
        while (currentDate <= dto.EndDate)
        {
            var alreadyExists = await _absenceRepo.IsAbsentForRouteAsync(dto.PassengerId, dto.RouteId, currentDate);
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

    public async Task SetDefaultPreferenceAsync(int passengerId, int routeId, int? pickupStopId, int? dropoffStopId)
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
        int? pickupStopId = dto.PickupStopId;
        int? dropoffStopId = dto.DropoffStopId;

        var newStart = dto.StartDate;
        var newEnd = dto.EndDate;

        // Fetch ALL active temporary preferences for this passenger and route
        var existingList = await _tempPreferenceRepo.FindAsync(p =>
            p.PassengerId == passengerId &&
            p.RouteId == dto.RouteId &&
            (p.IsActive ?? true));

        foreach (var existing in existingList)
        {
            bool hasSameStops = existing.PickupStopId == pickupStopId && existing.DropoffStopId == dropoffStopId;
            bool isOverlapping = !(existing.StartDate > newEnd || existing.EndDate < newStart);
            bool isAdjacent = existing.EndDate == newStart.AddDays(-1) || existing.StartDate == newEnd.AddDays(1);

            if (hasSameStops && (isOverlapping || isAdjacent))
            {
                // We can absorb this into our new range and deactivate the old one
                if (existing.StartDate < newStart) newStart = existing.StartDate;
                if (existing.EndDate > newEnd) newEnd = existing.EndDate;

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                _tempPreferenceRepo.Update(existing);
            }
            else if (isOverlapping) // different stops, but overlaps
            {
                // We need to split or shrink the existing record
                if (existing.StartDate < newStart && existing.EndDate > newEnd)
                {
                    // Split into two
                    var left = new TblpassengerTemporaryPreference
                    {
                        PassengerId = existing.PassengerId,
                        RouteId = existing.RouteId,
                        PickupStopId = existing.PickupStopId,
                        DropoffStopId = existing.DropoffStopId,
                        StartDate = existing.StartDate,
                        EndDate = newStart.AddDays(-1),
                        Description = existing.Description,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    var right = new TblpassengerTemporaryPreference
                    {
                        PassengerId = existing.PassengerId,
                        RouteId = existing.RouteId,
                        PickupStopId = existing.PickupStopId,
                        DropoffStopId = existing.DropoffStopId,
                        StartDate = newEnd.AddDays(1),
                        EndDate = existing.EndDate,
                        Description = existing.Description,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _tempPreferenceRepo.AddAsync(left);
                    await _tempPreferenceRepo.AddAsync(right);

                    existing.IsActive = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                    _tempPreferenceRepo.Update(existing);
                }
                else if (existing.StartDate >= newStart && existing.EndDate <= newEnd)
                {
                    // Fully covered by new record, just deactivate
                    existing.IsActive = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                    _tempPreferenceRepo.Update(existing);
                }
                else if (existing.StartDate < newStart && existing.EndDate >= newStart)
                {
                    // Overlaps on the left
                    existing.EndDate = newStart.AddDays(-1);
                    existing.UpdatedAt = DateTime.UtcNow;
                    _tempPreferenceRepo.Update(existing);
                }
                else if (existing.StartDate <= newEnd && existing.EndDate > newEnd)
                {
                    // Overlaps on the right
                    existing.StartDate = newEnd.AddDays(1);
                    existing.UpdatedAt = DateTime.UtcNow;
                    _tempPreferenceRepo.Update(existing);
                }
            }
        }

        var entity = new TblpassengerTemporaryPreference
        {
            PassengerId = passengerId,
            RouteId = dto.RouteId,
            PickupStopId = pickupStopId,
            DropoffStopId = dropoffStopId,
            StartDate = newStart,
            EndDate = newEnd,
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
