using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RoutePoster.Application.DTOs.Auth;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Domain.Entities; // For Tbluser
using BCrypt.Net;

namespace RoutePoster.Application.Services;

public class AuthService : IAuthService
{
    private readonly IGenericRepository<Tbluser> _userRepository;
    private readonly IGenericRepository<Tblrole> _roleRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        IGenericRepository<Tbluser> userRepository,
        IGenericRepository<Tblrole> roleRepository,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto)
    {
        var users = await _userRepository.FindAsync(u => u.Email == loginDto.Email);
        var user = users.FirstOrDefault();

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return null;
        }

        return await CreateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto registerDto)
    {
        var existingUsers = await _userRepository.FindAsync(u => u.Email == registerDto.Email);
        if (existingUsers.Any())
        {
            return null;
        }

        var user = new Tbluser
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            RoleId = registerDto.RoleId ?? 0,
            ClientId = registerDto.ClientId,
            TransportCompanyId = registerDto.TransportCompanyId,
            DepartmentId = registerDto.DepartmentId,
            IdentityNumber = registerDto.IdentityNumber,
            Phone = registerDto.Phone,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return await CreateAuthResponseAsync(user, registerDto.RoleId, registerDto.ClientId);
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDto changePasswordDto)
    {
        var user = await _userRepository.GetByIdAsync(changePasswordDto.UserId);
        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return false;
        }

        if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
        user.UpdatedAt = DateTime.Now;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return true;
    }


    private async Task<AuthResponseDto> CreateAuthResponseAsync(
        Tbluser user,
        int? fallbackRoleId = null,
        int? fallbackClientId = null)
    {
        var roleId = user.RoleId != 0 ? user.RoleId : (fallbackRoleId ?? 0);
        var clientId = user.ClientId ?? fallbackClientId;

        // Fetch role dynamically from repository to guarantee it exists and prevents null RoleName
        var roles = await _roleRepository.FindAsync(r => r.Id == roleId);
        var role = roles.FirstOrDefault();
        if (role != null)
        {
            user.Role = role;
        }

        var token = GenerateJwtToken(user, roleId, clientId);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                UserId = user.Id,
                ClientId = clientId,
                RoleId = roleId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? "",
                RoleName = role?.RoleName ?? user.Role?.RoleName ?? ResolveRoleName(roleId)
            }
        };
    }

    private string GenerateJwtToken(Tbluser user, int? roleId, int? clientId)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "SUPER_SECRET_KEY_THAT_IS_LONG_ENOUGH_12345");

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(BuildClaims(user, roleId, clientId)),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static IEnumerable<Claim> BuildClaims(Tbluser user, int? roleId, int? clientId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, user.Role?.RoleCode ?? roleId?.ToString() ?? "User")
        };

        if (roleId.HasValue)
        {
            claims.Add(new Claim("roleId", roleId.Value.ToString()));
        }

        if (clientId.HasValue)
        {
            claims.Add(new Claim("clientId", clientId.Value.ToString()));
        }

        return claims;
    }

    private static string? ResolveRoleName(int? roleId)
    {
        return roleId switch
        {
            6 => "Transport Manager",
            5 => "Driver",
            1 => "Admin",
            _ => null
        };
    }
}
