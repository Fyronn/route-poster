using System;

namespace RoutePoster.Application.DTOs.Trips
{
    public class TripDto
    {
        public int SeferId { get; set; }
        public int? RotaId { get; set; }
        public DateOnly SeferTarihi { get; set; }
        public DateTime? BaslamaZamani { get; set; }
        public DateTime? BitisZamani { get; set; }
        public string? Statu { get; set; }
    }
}
