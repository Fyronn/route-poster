namespace RoutePoster.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int? RoleId { get; set; }
    public int? ClientId { get; set; }
}
