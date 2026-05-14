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

    [HttpGet]
    public async Task<IActionResult> GetPreferences(int passengerId)
    {
        var preferences = await _preferenceService.GetPreferencesAsync(passengerId);
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

    [HttpPost("default")]
    public async Task<IActionResult> SetDefaultPreference(int passengerId, [FromQuery] int routeId, [FromQuery] int stopId)
    {
        await _preferenceService.SetDefaultPreferenceAsync(passengerId, routeId, stopId);
        return Ok(new { Message = "Default preference updated successfully." });
    }

    [HttpPost("temporary")]
    public async Task<IActionResult> AddTemporaryPreference(int passengerId, [FromBody] CreateTemporaryPreferenceDto dto)
    {
        await _preferenceService.AddTemporaryPreferenceAsync(passengerId, dto);
        return Ok(new { Message = "Temporary preference added successfully." });
    }
}
