using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests
{
    public class RouteRequestDto
    {
        public int RotaId { get; set; }
        public int? KurumId { get; set; }
        public string? RotaAdi { get; set; }
        public string? Statu { get; set; } // "Talep Edildi", "Plan Gönderildi", "Onaylandı"
        public string? VardiyaTipi { get; set; }
        public string? Yon { get; set; }
        public string? CalismaGunleri { get; set; }
        public TimeOnly? PlanlananBaslangicSaati { get; set; }
        public int? TahminiSureDakika { get; set; }
        public bool? AktifMi { get; set; }
    }
}
