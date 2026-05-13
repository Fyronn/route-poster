namespace RoutePoster.Application.DTOs.Auth;

public class UserDto
{
    public int UserId { get; set; }
    public int? ClientId { get; set; }
    public int? RoleId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? RoleName { get; set; }
}
