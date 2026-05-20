using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;

namespace RoutePoster.Application.Services.Interfaces;

public interface IPassengerPreferenceService
{
    Task<IEnumerable<PassengerAbsenceDto>> GetAbsencesAsync(int passengerId);
    Task<IEnumerable<PassengerPreferenceDto>> GetTemporaryPreferencesAsync(int passengerId);
    Task<IEnumerable<PassengerPreferenceDto>> GetEffectivePreferenceAsync(int passengerId, DateOnly date);
    Task<PassengerPreferenceDto?> GetDefaultPreferenceAsync(int passengerId, int routeId);
    Task SetDefaultPreferenceAsync(int passengerId, int routeId, int? pickupStopId, int? dropoffStopId);
    Task AddTemporaryPreferenceAsync(int passengerId, CreateTemporaryPreferenceDto dto);
    Task<DailyStatusDto> GetDailyStatusAsync(int passengerId, DateOnly date);
    Task AddAbsenceRangeAsync(CreateAbsenceDto dto);
    Task<IEnumerable<RouteRequestDto>> GetPassengerRoutesAsync(int passengerId);
}
