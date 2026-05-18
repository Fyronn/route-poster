using System;

namespace RoutePoster.Application.DTOs.TripAssignments
{
    public class TripAssignmentDto
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public DateOnly? TripDate { get; set; }
        public string? VehiclePlateNumber { get; set; }
        public string? DriverFirstName { get; set; }
        public string? DriverLastName { get; set; }
        public int? ServiceSupervisorId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
    }
}
