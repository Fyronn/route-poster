using System;

namespace RoutePoster.Application.DTOs.Trips
{
    public class CreateTripDto
    {
        public int RotaId { get; set; }
        public DateOnly SeferTarihi { get; set; }
        public DateTime? BaslamaZamani { get; set; }
        public DateTime? BitisZamani { get; set; }
    }
}
