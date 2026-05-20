using System;
using System.Collections.Generic;

namespace RoutePoster.Application.DTOs.Drivers
{
    public class DriverPlannedTripDto
    {
        public int TripId { get; set; }
        public DateOnly TripDate { get; set; }
        public string? Status { get; set; }
        public int? VehicleId { get; set; }
        public string? VehiclePlateNumber { get; set; }
        public int RouteId { get; set; }
        public string RouteName { get; set; } = null!;
        public TimeOnly PlannedStartTime { get; set; }
        public List<DriverPlannedTripStopDto> Stops { get; set; } = new();
    }

    public class DriverPlannedTripStopDto
    {
        public int StopId { get; set; }
        public string StopName { get; set; } = null!;
        public int StopOrder { get; set; }
        public TimeOnly TargetArrivalTime { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
