using System;
using System.Collections.Generic;

namespace RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests
{
    public class RouteRequestDto
    {
        public int RouteId { get; set; }
        public int? ClientId { get; set; }
        public string? RouteName { get; set; }
        public string? Status { get; set; }
        public string? ShiftType { get; set; }
        public string? Direction { get; set; }
        public string? OperatingDays { get; set; }
        public TimeOnly? PlannedStartTime { get; set; }
        public int? EstimatedDurationMinutes { get; set; }
        public bool? IsActive { get; set; }
        
        public List<RouteStopDto> Stops { get; set; } = new();
        public List<RoutePassengerDto> Passengers { get; set; } = new();
    }

    public class RouteStopDto
    {
        public int StopId { get; set; }
        public string StopName { get; set; } = string.Empty;
        public int? StopOrder { get; set; }
    }

    public class RoutePassengerDto
    {
        public int PassengerId { get; set; }
        public string FullName { get; set; } = string.Empty;
    }
}
