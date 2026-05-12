using RoutePoster.Application.DTOs.Auth;

namespace RoutePoster.Application.Services.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<RoleDto>> GetAllAsync();
}
