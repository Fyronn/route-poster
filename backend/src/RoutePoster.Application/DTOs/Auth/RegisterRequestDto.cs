namespace RoutePoster.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string Ad { get; set; } = null!;
    public string Soyad { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int? RolId { get; set; }
    public int? KurumId { get; set; }
}
