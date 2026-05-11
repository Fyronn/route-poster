namespace RoutePoster.Application.DTOs.Auth;

public class UserDto
{
    public int KullaniciId { get; set; }
    public string Ad { get; set; } = null!;
    public string Soyad { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? RolAdi { get; set; }
}
