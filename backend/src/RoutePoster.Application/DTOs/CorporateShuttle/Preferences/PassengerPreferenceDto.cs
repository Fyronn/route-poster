using System;
using System.Collections.Generic;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;

namespace RoutePoster.Application.DTOs.CorporateShuttle.Preferences;

public class PassengerPreferenceDto
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public int? PickupStopId { get; set; }
    public string? PickupStopName { get; set; }
    public string? PickupStopAddress { get; set; }
    public int? DropoffStopId { get; set; }
    public string? DropoffStopName { get; set; }
    public string? DropoffStopAddress { get; set; }
    public string? LastStopName { get; set; }
    public bool IsTemporary { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public List<RouteStopDto> Stops { get; set; } = new();
}

public class SetDefaultPreferenceDto
{
    public int RouteId { get; set; }
    public int? PickupStopId { get; set; }
    public int? DropoffStopId { get; set; }
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
    public List<PassengerPreferenceDto> Preferences { get; set; } = new();
}

public class PassengerAbsenceDto
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public DateOnly AbsenceDate { get; set; }
    public string? Description { get; set; }
}
