namespace RoutePoster.Application.DTOs.CorporateShuttle.Employees
{
    public class UpdateEmployeeDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? IdentityNumber { get; set; }
        public bool? IsActive { get; set; }
    }
}
