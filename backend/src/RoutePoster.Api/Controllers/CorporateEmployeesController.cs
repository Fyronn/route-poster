using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.Employees;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/corporate-shuttle/clients/{clientId}/employees")]
    public class CorporateEmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public CorporateEmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetByClientId(int clientId)
        {
            var employees = await _employeeService.GetByClientIdAsync(clientId);
            return Ok(employees);
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create(int clientId, [FromBody] CreateEmployeeDto dto)
        {
            dto.KurumId = clientId;
            var createdEmployee = await _employeeService.CreateAsync(dto);
            return Ok(createdEmployee);
        }
    }
}
