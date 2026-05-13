namespace RoutePoster.Application.DTOs.Drivers
{
    public class CreateDriverDto
    {
        public string? IdentityNumber { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool? IsActive { get; set; }
        public string? PasswordHash { get; set; } 
    }
}
