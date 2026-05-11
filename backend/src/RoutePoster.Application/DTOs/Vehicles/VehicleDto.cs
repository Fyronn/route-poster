namespace RoutePoster.Application.DTOs.Vehicles
{
    public class VehicleDto
    {
        public int AracId { get; set; }
        public int? TurizmFirmaId { get; set; }
        public string Plaka { get; set; } = null!;
        public int Kapasite { get; set; }
        public string? MarkaModel { get; set; }
        public int? UretimYili { get; set; }
        public string? AracTipi { get; set; }
        public string? DonanimOzellikleri { get; set; }
        public bool? AktifMi { get; set; }
    }
}
