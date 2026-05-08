using System;

namespace RoutePoster.Application.DTOs.Clients
{
    public class ClientDto
    {
        public int KurumId { get; set; }
        public string KurumAdi { get; set; } = null!;
        public string? KurumTipi { get; set; } // Transport Type (e.g. CorporateShuttle)
        public string? VergiNo { get; set; }
        public string? AdresIl { get; set; }
        public string? AdresIlce { get; set; }
        public bool? AktifMi { get; set; }
        
        // Note: The following fields are not in the existing database but requested by frontend flow.
        // In a real DB-First scenario where DB isn't updated, they won't be saved or fetched unless mapped differently.
        public string? YetkiliKisi { get; set; } 
        public string? Telefon { get; set; }
        public string? Email { get; set; }
        public string? KurulumTercihi { get; set; }
    }
}
