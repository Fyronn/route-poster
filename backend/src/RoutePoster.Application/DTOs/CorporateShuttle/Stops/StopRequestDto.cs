namespace RoutePoster.Application.DTOs.CorporateShuttle.Stops
{
    public class StopRequestDto
    {
        public int StopId { get; set; }
        public int? ClientId { get; set; }
        public string? StopName { get; set; }
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? Status { get; set; } // "Requested", "Approved"
        public string? OperatorNote { get; set; }
        public bool? IsActive { get; set; }
        public int? RouteId { get; set; }
        public string? RouteName { get; set; }
    }
}
