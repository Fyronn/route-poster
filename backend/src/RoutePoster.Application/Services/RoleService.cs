using RoutePoster.Application.DTOs.Auth;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

namespace RoutePoster.Application.Services;

public class RoleService : IRoleService
{
    private readonly IGenericRepository<TblRoller> _roleRepository;

    public RoleService(IGenericRepository<TblRoller> roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task<IEnumerable<RoleDto>> GetAllAsync()
    {
        var roles = await _roleRepository.GetAllAsync();
        return roles.Select(r => new RoleDto
        {
            RolId = r.RolId,
            RolKodu = r.RolKodu,
            RolAdi = r.RolAdi
        });
    }
}
