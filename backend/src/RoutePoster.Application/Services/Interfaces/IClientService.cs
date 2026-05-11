using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Clients;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetAllAsync();
        Task<ClientDto?> GetByIdAsync(int id);
        Task<ClientDto> CreateAsync(CreateClientDto dto);
        Task UpdateAsync(int id, UpdateClientDto dto);
        Task DeleteAsync(int id);
    }
}
