namespace RoutePoster.Application.DTOs.Auth;

public class ChangePasswordRequestDto
{
    public int UserId { get; set; }
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
