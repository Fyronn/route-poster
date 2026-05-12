using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Employees;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

namespace RoutePoster.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<EmployeeDto>> GetByKurumIdAsync(int kurumId)
        {
            var entities = await _employeeRepository.FindAsync(e => e.KurumId == kurumId);
            return entities.Select(MapToDto);
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var entity = new TblKullanicilar
            {
                KurumId = dto.KurumId,
                Ad = dto.Ad,
                Soyad = dto.Soyad,
                Email = dto.Email,
                Telefon = dto.Telefon,
                KimlikNo = dto.KimlikNo,
                AktifMi = true,
                OlusturmaTarihi = DateTime.UtcNow
            };

            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        private EmployeeDto MapToDto(TblKullanicilar entity)
        {
            return new EmployeeDto
            {
                KullaniciId = entity.KullaniciId,
                KurumId = entity.KurumId,
                Ad = entity.Ad,
                Soyad = entity.Soyad,
                Email = entity.Email,
                Telefon = entity.Telefon,
                KimlikNo = entity.KimlikNo,
                AktifMi = entity.AktifMi
            };
        }
    }
}
