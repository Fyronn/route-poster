using System;

namespace RoutePoster.Application.DTOs.Trips
{
    public class TripDto
    {
        public int TripId { get; set; }
        public int? RouteId { get; set; }
        public DateOnly TripDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? Status { get; set; }
    }
}
