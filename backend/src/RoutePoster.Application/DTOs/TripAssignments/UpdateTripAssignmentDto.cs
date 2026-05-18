namespace RoutePoster.Application.DTOs.TripAssignments
{
    public class UpdateTripAssignmentDto
    {
        public int TripId { get; set; }
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public int? ServiceSupervisorId { get; set; }
    }
}
