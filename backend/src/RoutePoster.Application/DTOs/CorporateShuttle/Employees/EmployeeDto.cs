using System;

namespace RoutePoster.Application.DTOs.CorporateShuttle.Employees
{
    public class EmployeeDto
    {
        public int UserId { get; set; }
        public int? ClientId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? IdentityNumber { get; set; }
        public bool? IsActive { get; set; }
    }
}
