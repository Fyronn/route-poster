using RoutePoster.Application.DTOs.Auth;

namespace RoutePoster.Application.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto registerDto);
    Task<bool> ChangePasswordAsync(ChangePasswordRequestDto changePasswordDto);
}

