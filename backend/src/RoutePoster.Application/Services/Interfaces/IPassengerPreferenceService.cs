using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;

namespace RoutePoster.Application.Services.Interfaces;

public interface IPassengerPreferenceService
{
    Task<IEnumerable<PassengerPreferenceDto>> GetPreferencesAsync(int passengerId);
    Task<PassengerPreferenceDto?> GetEffectivePreferenceAsync(int passengerId, DateOnly date);
    Task SetDefaultPreferenceAsync(int passengerId, int routeId, int stopId);
    Task AddTemporaryPreferenceAsync(int passengerId, CreateTemporaryPreferenceDto dto);
}
