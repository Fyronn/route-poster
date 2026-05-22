using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Employees;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<EmployeeDto>> GetByClientIdAsync(int clientId)
        {
            var entities = await _employeeRepository.FindAsync(e => e.ClientId == clientId);
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
            var entity = new Tbluser
            {
                ClientId = dto.ClientId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                IdentityNumber = dto.IdentityNumber,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                RoleId = 4 // Default employee role if not specified
            };

            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null) return null;

            if (dto.FirstName != null) entity.FirstName = dto.FirstName;
            if (dto.LastName != null) entity.LastName = dto.LastName;
            if (dto.Email != null) entity.Email = dto.Email;
            if (dto.Phone != null) entity.Phone = dto.Phone;
            if (dto.IdentityNumber != null) entity.IdentityNumber = dto.IdentityNumber;
            if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;

            entity.UpdatedAt = DateTime.UtcNow;

            _employeeRepository.Update(entity);
            await _employeeRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null) return false;

            _employeeRepository.Remove(entity);
            await _employeeRepository.SaveChangesAsync();
            return true;
        }

        private EmployeeDto MapToDto(Tbluser entity)
        {
            return new EmployeeDto
            {
                UserId = entity.Id,
                ClientId = entity.ClientId,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                IdentityNumber = entity.IdentityNumber,
                IsActive = entity.IsActive
            };
        }
    }
}
