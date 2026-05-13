using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests
{
    public class CreateRouteRequestDto
    {
        public int? ClientId { get; set; }
        public string? RouteName { get; set; }
        public string? ShiftType { get; set; }
        public string? Direction { get; set; }
        public string? OperatingDays { get; set; }
        public TimeOnly? PlannedStartTime { get; set; }
    }
}
