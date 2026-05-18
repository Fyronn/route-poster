using System;

namespace RoutePoster.Application.DTOs.TripAttendances
{
    public class UpdateTripAttendanceDto
    {
        public int TripId { get; set; }
        public int PassengerId { get; set; }
        public int StopId { get; set; }
        public string? AttendanceStatus { get; set; }
        public DateTime? ActionTime { get; set; }
        public int ActionByUserId { get; set; }
    }
}
