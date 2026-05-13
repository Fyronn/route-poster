namespace RoutePoster.Application.DTOs.CorporateShuttle.Stops
{
    public class CreateStopRequestDto
    {
        public int? ClientId { get; set; }
        public string? StopName { get; set; }
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? OperatorNote { get; set; }
    }
}
