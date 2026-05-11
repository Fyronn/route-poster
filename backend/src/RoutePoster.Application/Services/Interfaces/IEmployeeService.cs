using System.Collections.Generic;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.Employees;

namespace RoutePoster.Application.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetByClientIdAsync(int clientId);
        Task<EmployeeDto?> GetByIdAsync(int id);
        Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    }
}
