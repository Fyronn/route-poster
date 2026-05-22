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
            dto.ClientId = clientId;
            var createdEmployee = await _employeeService.CreateAsync(dto);
            return Ok(createdEmployee);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeDto>> Update(int clientId, int id, [FromBody] UpdateEmployeeDto dto)
        {
            var existingEmployee = await _employeeService.GetByIdAsync(id);
            if (existingEmployee == null || existingEmployee.ClientId != clientId)
            {
                return NotFound();
            }

            var updatedEmployee = await _employeeService.UpdateAsync(id, dto);
            return Ok(updatedEmployee);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int clientId, int id)
        {
            var existingEmployee = await _employeeService.GetByIdAsync(id);
            if (existingEmployee == null || existingEmployee.ClientId != clientId)
            {
                return NotFound();
            }

            var result = await _employeeService.DeleteAsync(id);
            if (!result) return NotFound();

            return NoContent();
        }
    }
}
