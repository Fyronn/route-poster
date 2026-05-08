namespace RoutePoster.Application.DTOs.Clients
{
    public class UpdateClientDto
    {
        public string KurumAdi { get; set; } = null!;
        public string? KurumTipi { get; set; }
        public string? VergiNo { get; set; }
        public string? AdresIl { get; set; }
        public string? AdresIlce { get; set; }
        public bool? AktifMi { get; set; }
        
        // Extra fields from UI (not in DB)
        public string? YetkiliKisi { get; set; } 
        public string? Telefon { get; set; }
        public string? Email { get; set; }
        public string? KurulumTercihi { get; set; }
    }
}
