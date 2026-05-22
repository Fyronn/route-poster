namespace RoutePoster.Application.DTOs.CorporateShuttle.Stops
{
    public class UpdateStopRequestDto
    {
        public string? StopName { get; set; }
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? OperatorNote { get; set; }
        public bool? IsActive { get; set; }
        public string? Status { get; set; }
    }
}
