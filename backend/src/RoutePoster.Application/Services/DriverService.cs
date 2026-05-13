using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.Drivers;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

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
            var entities = await _employeeRepository.FindAsync(e => e.RoleId == DriverRoleId);
            return entities.Select(MapToDto);
        }

        public async Task<DriverDto?> GetByIdAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null || entity.RoleId != DriverRoleId) return null;
            return MapToDto(entity);
        }

        public async Task<DriverDto> CreateAsync(CreateDriverDto dto)
        {
            var entity = new Tbluser
            {
                RoleId = DriverRoleId,
                IdentityNumber = dto.IdentityNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = dto.PasswordHash ?? "default_hash", 
                IsActive = dto.IsActive ?? true,
                CreatedAt = DateTime.UtcNow
            };

            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateAsync(int id, UpdateDriverDto dto)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RoleId == DriverRoleId)
            {
                entity.IdentityNumber = dto.IdentityNumber;
                entity.FirstName = dto.FirstName;
                entity.LastName = dto.LastName;
                entity.Email = dto.Email;
                entity.Phone = dto.Phone;
                entity.IsActive = dto.IsActive;

                _employeeRepository.Update(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity != null && entity.RoleId == DriverRoleId)
            {
                _employeeRepository.Remove(entity);
                await _employeeRepository.SaveChangesAsync();
            }
        }

        private DriverDto MapToDto(Tbluser entity)
        {
            return new DriverDto
            {
                UserId = entity.Id,
                IdentityNumber = entity.IdentityNumber,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                IsActive = entity.IsActive
            };
        }
    }
}
