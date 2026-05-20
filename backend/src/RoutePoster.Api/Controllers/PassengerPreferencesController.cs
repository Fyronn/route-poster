using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.Preferences;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers;

[ApiController]
[Route("api/passengers/{passengerId}/preferences")]
public class PassengerPreferencesController : ControllerBase
{
    private readonly IPassengerPreferenceService _preferenceService;

    public PassengerPreferencesController(IPassengerPreferenceService preferenceService)
    {
        _preferenceService = preferenceService;
    }

    [HttpGet("absences")]
    public async Task<IActionResult> GetAbsences(int passengerId)
    {
        var absences = await _preferenceService.GetAbsencesAsync(passengerId);
        return Ok(absences);
    }

    [HttpGet("temporary")]
    public async Task<IActionResult> GetTemporaryPreferences(int passengerId)
    {
        var preferences = await _preferenceService.GetTemporaryPreferencesAsync(passengerId);
        return Ok(preferences);
    }

    [HttpGet("effective")]
    public async Task<IActionResult> GetEffectivePreference(int passengerId, [FromQuery] string date)
    {
        if (!DateOnly.TryParse(date, out var dateOnly))
        {
            return BadRequest("Invalid date format. Use YYYY-MM-DD.");
        }

        var preference = await _preferenceService.GetEffectivePreferenceAsync(passengerId, dateOnly);
        return Ok(preference);
    }

    [HttpGet("daily-status")]
    public async Task<IActionResult> GetDailyStatus(int passengerId, [FromQuery] string date)
    {
        if (!DateOnly.TryParse(date, out var dateOnly))
        {
            return BadRequest("Invalid date format. Use YYYY-MM-DD.");
        }

        var status = await _preferenceService.GetDailyStatusAsync(passengerId, dateOnly);
        return Ok(status);
    }

    [HttpPost("absences")]
    public async Task<IActionResult> AddAbsence(int passengerId, [FromBody] CreateAbsenceDto dto)
    {
        dto.PassengerId = passengerId;
        await _preferenceService.AddAbsenceRangeAsync(dto);
        return Ok(new { Message = "Absence record(s) added successfully." });
    }

    [HttpGet("default")]
    public async Task<IActionResult> GetDefaultPreference(int passengerId, [FromQuery] int routeId)
    {
        var preference = await _preferenceService.GetDefaultPreferenceAsync(passengerId, routeId);
        if (preference == null)
            return NotFound(new { Message = "Default preference not found for this route." });

        return Ok(preference);
    }

    [HttpPost("default")]
    public async Task<IActionResult> SetDefaultPreference(int passengerId, [FromBody] SetDefaultPreferenceDto dto)
    {
        await _preferenceService.SetDefaultPreferenceAsync(passengerId, dto.RouteId, dto.PickupStopId, dto.DropoffStopId);
        return Ok(new { Message = "Default preference updated successfully." });
    }

    [HttpPost("temporary")]
    public async Task<IActionResult> AddTemporaryPreference(int passengerId, [FromBody] CreateTemporaryPreferenceDto dto)
    {
        await _preferenceService.AddTemporaryPreferenceAsync(passengerId, dto);
        return Ok(new { Message = "Temporary preference added successfully." });
    }

    [HttpGet("routes")]
    public async Task<IActionResult> GetPassengerRoutes(int passengerId)
    {
        var routes = await _preferenceService.GetPassengerRoutesAsync(passengerId);
        return Ok(routes);
    }
}
