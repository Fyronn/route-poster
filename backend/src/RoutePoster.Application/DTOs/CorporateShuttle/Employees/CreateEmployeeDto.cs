namespace RoutePoster.Application.DTOs.CorporateShuttle.Employees
{
    public class CreateEmployeeDto
    {
        public int? KurumId { get; set; }
        public string Ad { get; set; } = null!;
        public string Soyad { get; set; } = null!;
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? KimlikNo { get; set; }
    }
}
