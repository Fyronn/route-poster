namespace RoutePoster.Application.DTOs.CorporateShuttle.Employees
{
    public class CreateEmployeeDto
    {
        public int? ClientId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? IdentityNumber { get; set; }
    }
}
