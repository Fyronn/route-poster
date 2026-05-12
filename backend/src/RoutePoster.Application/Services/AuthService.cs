using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RoutePoster.Application.DTOs.Auth;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure; // For TblKullanicilar
using BCrypt.Net;

namespace RoutePoster.Application.Services;

public class AuthService : IAuthService
{
    private readonly IGenericRepository<TblKullanicilar> _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IGenericRepository<TblKullanicilar> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto)
    {
        var users = await _userRepository.FindAsync(u => u.Email == loginDto.Email);
        var user = users.FirstOrDefault();

        if (user == null || string.IsNullOrEmpty(user.SifreHash) || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.SifreHash))
        {
            return null;
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto registerDto)
    {
        var existingUsers = await _userRepository.FindAsync(u => u.Email == registerDto.Email);
        if (existingUsers.Any())
        {
            return null;
        }

        var user = new TblKullanicilar
        {
            Ad = registerDto.Ad,
            Soyad = registerDto.Soyad,
            Email = registerDto.Email,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            RolId = registerDto.RolId,
            KurumId = registerDto.KurumId,
            AktifMi = true,
            OlusturmaTarihi = DateTime.Now
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return CreateAuthResponse(user, registerDto.RolId, registerDto.KurumId);
    }

    private AuthResponseDto CreateAuthResponse(
        TblKullanicilar user,
        int? fallbackRolId = null,
        int? fallbackKurumId = null)
    {
        var rolId = user.RolId ?? fallbackRolId;
        var kurumId = user.KurumId ?? fallbackKurumId;
        var token = GenerateJwtToken(user, rolId, kurumId);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                KullaniciId = user.KullaniciId,
                KurumId = kurumId,
                RolId = rolId,
                Ad = user.Ad,
                Soyad = user.Soyad,
                Email = user.Email ?? "",
                RolAdi = user.Rol?.RolAdi ?? ResolveRoleName(rolId)
            }
        };
    }

    private string GenerateJwtToken(TblKullanicilar user, int? rolId, int? kurumId)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "SUPER_SECRET_KEY_THAT_IS_LONG_ENOUGH_12345");

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(BuildClaims(user, rolId, kurumId)),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static IEnumerable<Claim> BuildClaims(TblKullanicilar user, int? rolId, int? kurumId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.KullaniciId.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, user.Rol?.RolKodu ?? rolId?.ToString() ?? "User")
        };

        if (rolId.HasValue)
        {
            claims.Add(new Claim("rolId", rolId.Value.ToString()));
        }

        if (kurumId.HasValue)
        {
            claims.Add(new Claim("kurumId", kurumId.Value.ToString()));
        }

        return claims;
    }

    private static string? ResolveRoleName(int? rolId)
    {
        return rolId switch
        {
            6 => "Servis Yoneticisi",
            5 => "Surucu",
            1 => "Admin",
            _ => null
        };
    }
}
