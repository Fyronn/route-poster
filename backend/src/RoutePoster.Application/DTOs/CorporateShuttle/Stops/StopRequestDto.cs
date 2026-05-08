namespace RoutePoster.Application.DTOs.CorporateShuttle.Stops
{
    public class StopRequestDto
    {
        public int DurakId { get; set; }
        public int? KurumId { get; set; }
        public string? DurakAdi { get; set; }
        public string? Adres { get; set; }
        public decimal? Enlem { get; set; }
        public decimal? Boylam { get; set; }
        public string? Statu { get; set; } // "Talep Edildi", "Onaylandi"
        public string? OperatorNotu { get; set; }
        public bool? AktifMi { get; set; }
    }
}
