using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests
{
    public class CreateRouteRequestDto
    {
        public int? KurumId { get; set; }
        public string? RotaAdi { get; set; }
        public string? VardiyaTipi { get; set; }
        public string? Yon { get; set; }
        public string? CalismaGunleri { get; set; }
        public TimeOnly? PlanlananBaslangicSaati { get; set; }
    }
}
