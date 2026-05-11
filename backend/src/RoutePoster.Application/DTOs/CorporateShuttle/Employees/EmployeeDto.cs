using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.Employees
{
    public class EmployeeDto
    {
        public int KullaniciId { get; set; }
        public int? KurumId { get; set; }
        public string Ad { get; set; } = null!;
        public string Soyad { get; set; } = null!;
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? KimlikNo { get; set; }
        public bool? AktifMi { get; set; }
    }
}
