using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests
{
    public class RouteRequestDto
    {
        public int RouteId { get; set; }
        public int? ClientId { get; set; }
        public string? RouteName { get; set; }
        public string? Status { get; set; } // "Requested", "Plan Sent", "Approved"
        public string? ShiftType { get; set; }
        public string? Direction { get; set; }
        public string? OperatingDays { get; set; }
        public TimeOnly? PlannedStartTime { get; set; }
        public int? EstimatedDurationMinutes { get; set; }
        public bool? IsActive { get; set; }
    }
}
