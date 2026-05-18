namespace RoutePoster.Application.DTOs.TripAssignments
{
    public class CreateTripAssignmentDto
    {
        public int TripId { get; set; }
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public int? ServiceSupervisorId { get; set; }
        public int? CreatedBy { get; set; }
    }
}
