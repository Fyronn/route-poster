using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.Preferences;

public class PassengerPreferenceDto
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public int PickupStopId { get; set; }
    public string PickupStopName { get; set; } = string.Empty;
    public bool IsTemporary { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}

public class CreateTemporaryPreferenceDto
{
    public int RouteId { get; set; }
    public int PickupStopId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Description { get; set; }
}
