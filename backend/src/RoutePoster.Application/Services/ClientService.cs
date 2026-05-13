using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Clients;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<IEnumerable<ClientDto>> GetAllAsync()
        {
            var entities = await _clientRepository.GetAllAsync();
            return entities.Select(MapToDto);
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var entity = await _clientRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<ClientDto> CreateAsync(CreateClientDto dto)
        {
            var entity = new Tblclient
            {
                ClientName = dto.ClientName,
                ClientType = dto.ClientType,
                TaxNumber = dto.TaxNumber,
                City = dto.City,
                District = dto.District,
                IsActive = true,
                TransportCompanyId = 1 // Default or from context if available
            };

            await _clientRepository.AddAsync(entity);
            await _clientRepository.SaveChangesAsync();

            var resultDto = MapToDto(entity);
            
            resultDto.AuthorizedPerson = dto.AuthorizedPerson;
            resultDto.Phone = dto.Phone;
            resultDto.Email = dto.Email;
            resultDto.SetupPreference = dto.SetupPreference;

            return resultDto;
        }

        public async Task UpdateAsync(int id, UpdateClientDto dto)
        {
            var entity = await _clientRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.ClientName = dto.ClientName;
                entity.ClientType = dto.ClientType;
                entity.TaxNumber = dto.TaxNumber;
                entity.City = dto.City;
                entity.District = dto.District;
                entity.IsActive = dto.IsActive;

                _clientRepository.Update(entity);
                await _clientRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _clientRepository.GetByIdAsync(id);
            if (entity != null)
            {
                _clientRepository.Remove(entity);
                await _clientRepository.SaveChangesAsync();
            }
        }

        private ClientDto MapToDto(Tblclient entity)
        {
            return new ClientDto
            {
                ClientId = entity.Id,
                ClientName = entity.ClientName,
                ClientType = entity.ClientType,
                TaxNumber = entity.TaxNumber,
                City = entity.City,
                District = entity.District,
                IsActive = entity.IsActive
            };
        }
    }
}
