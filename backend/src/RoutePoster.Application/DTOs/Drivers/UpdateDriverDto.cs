namespace RoutePoster.Application.DTOs.Drivers
{
    public class UpdateDriverDto
    {
        public string? KimlikNo { get; set; }
        public string Ad { get; set; } = null!;
        public string Soyad { get; set; } = null!;
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public bool? AktifMi { get; set; }
    }
}
