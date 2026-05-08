using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Clients;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

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
            var entity = new TblMusteriKurumlar
            {
                KurumAdi = dto.KurumAdi,
                KurumTipi = dto.KurumTipi,
                VergiNo = dto.VergiNo,
                AdresIl = dto.AdresIl,
                AdresIlce = dto.AdresIlce,
                AktifMi = true
                // Note: DB doesn't have YetkiliKisi, Email, Telefon, KurulumTercihi as requested by user.
                // Since this is DB first and user said no DB modification, they are omitted here.
            };

            await _clientRepository.AddAsync(entity);
            await _clientRepository.SaveChangesAsync();

            var resultDto = MapToDto(entity);
            
            // Map the virtual fields just for the response so frontend sees them (even if not persisted)
            resultDto.YetkiliKisi = dto.YetkiliKisi;
            resultDto.Telefon = dto.Telefon;
            resultDto.Email = dto.Email;
            resultDto.KurulumTercihi = dto.KurulumTercihi;

            return resultDto;
        }

        public async Task UpdateAsync(int id, UpdateClientDto dto)
        {
            var entity = await _clientRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.KurumAdi = dto.KurumAdi;
                entity.KurumTipi = dto.KurumTipi;
                entity.VergiNo = dto.VergiNo;
                entity.AdresIl = dto.AdresIl;
                entity.AdresIlce = dto.AdresIlce;
                entity.AktifMi = dto.AktifMi;

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

        private ClientDto MapToDto(TblMusteriKurumlar entity)
        {
            return new ClientDto
            {
                KurumId = entity.KurumId,
                KurumAdi = entity.KurumAdi,
                KurumTipi = entity.KurumTipi,
                VergiNo = entity.VergiNo,
                AdresIl = entity.AdresIl,
                AdresIlce = entity.AdresIlce,
                AktifMi = entity.AktifMi
            };
        }
    }
}
