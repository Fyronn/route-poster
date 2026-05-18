using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.Preferences;

public class PassengerPreferenceDto
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public int PickupStopId { get; set; }
    public string PickupStopName { get; set; } = string.Empty;
    public string? PickupStopAddress { get; set; }
    public int? DropoffStopId { get; set; }
    public string? DropoffStopName { get; set; }
    public string? DropoffStopAddress { get; set; }
    public bool IsTemporary { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}

public class CreateTemporaryPreferenceDto
{
    public int RouteId { get; set; }
    public int? PickupStopId { get; set; }
    public int? DropoffStopId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Description { get; set; }
}

public class CreateAbsenceDto
{
    public int PassengerId { get; set; }
    public int RouteId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Reason { get; set; }
}

public class DailyStatusDto
{
    public bool IsAbsent { get; set; }
    public string? AbsenceReason { get; set; }
    public PassengerPreferenceDto? Preference { get; set; }
}

public class PassengerAbsenceDto
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public DateOnly AbsenceDate { get; set; }
    public string? Description { get; set; }
}
