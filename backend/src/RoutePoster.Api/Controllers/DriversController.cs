using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.Drivers;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/drivers")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriversController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DriverDto>>> GetAll()
        {
            var drivers = await _driverService.GetAllAsync();
            return Ok(drivers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DriverDto>> GetById(int id)
        {
            var driver = await _driverService.GetByIdAsync(id);
            if (driver == null) return NotFound();
            return Ok(driver);
        }

        [HttpPost]
        public async Task<ActionResult<DriverDto>> Create([FromBody] CreateDriverDto dto)
        {
            var createdDriver = await _driverService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdDriver.KullaniciId }, createdDriver);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDriverDto dto)
        {
            await _driverService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _driverService.DeleteAsync(id);
            return NoContent();
        }
    }
}
