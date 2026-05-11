using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Drivers;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

namespace RoutePoster.Application.Services
{
    public class DriverService : IDriverService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private const int DriverRoleId = 5;

        public DriverService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<DriverDto>> GetAllAsync()
        {
            var entities = await _employeeRepository.FindAsync(e => e.RolId == DriverRoleId);
            return entities.Select(MapToDto);
        }

        public async Task<DriverDto?> GetByIdAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null || entity.RolId != DriverRoleId) return null;
            return MapToDto(entity);
        }

        public async Task<DriverDto> CreateAsync(CreateDriverDto dto)
        {
            var entity = new TblKullanicilar
            {
                RolId = DriverRoleId,
                KimlikNo = dto.KimlikNo,
                Ad = dto.Ad,
                Soyad = dto.Soyad,
                Email = dto.Email,
                Telefon = dto.Telefon,
                SifreHash = dto.SifreHash ?? "default_hash", // Ideally hashed in real app
                AktifMi = dto.AktifMi ?? true,
                OlusturmaTarihi = DateTime.UtcNow
            };

            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateAsync(int id, UpdateDriverDto dto)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RolId == DriverRoleId)
            {
                entity.KimlikNo = dto.KimlikNo;
                entity.Ad = dto.Ad;
                entity.Soyad = dto.Soyad;
                entity.Email = dto.Email;
                entity.Telefon = dto.Telefon;
                entity.AktifMi = dto.AktifMi;

                _employeeRepository.Update(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RolId == DriverRoleId)
            {
                _employeeRepository.Remove(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        private DriverDto MapToDto(TblKullanicilar entity)
        {
            return new DriverDto
            {
                KullaniciId = entity.KullaniciId,
                KimlikNo = entity.KimlikNo,
                Ad = entity.Ad,
                Soyad = entity.Soyad,
                Email = entity.Email,
                Telefon = entity.Telefon,
                AktifMi = entity.AktifMi
            };
        }
    }
}
