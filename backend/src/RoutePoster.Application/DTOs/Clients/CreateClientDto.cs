namespace RoutePoster.Application.DTOs.Clients
{
    public class CreateClientDto
    {
        public string KurumAdi { get; set; } = null!;
        public string? KurumTipi { get; set; } // Transport Type
        public string? VergiNo { get; set; }
        public string? AdresIl { get; set; }
        public string? AdresIlce { get; set; }
        
        // Fields not in DB but from UI
        public string? YetkiliKisi { get; set; } 
        public string? Telefon { get; set; }
        public string? Email { get; set; }
        public string? KurulumTercihi { get; set; }
    }
}
