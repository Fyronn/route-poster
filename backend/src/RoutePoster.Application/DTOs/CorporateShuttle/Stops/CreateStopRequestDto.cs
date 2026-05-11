namespace RoutePoster.Application.DTOs.CorporateShuttle.Stops
{
    public class CreateStopRequestDto
    {
        public int? KurumId { get; set; }
        public string? DurakAdi { get; set; }
        public string? Adres { get; set; }
        public decimal? Enlem { get; set; }
        public decimal? Boylam { get; set; }
        public string? OperatorNotu { get; set; }
    }
}
