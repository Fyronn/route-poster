using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.Vehicles;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAll()
        {
            var vehicles = await _vehicleService.GetAllAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDto>> GetById(int id)
        {
            var vehicle = await _vehicleService.GetByIdAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        [HttpPost]
        public async Task<ActionResult<VehicleDto>> Create([FromBody] CreateVehicleDto dto)
        {
            var createdVehicle = await _vehicleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdVehicle.AracId }, createdVehicle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVehicleDto dto)
        {
            await _vehicleService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _vehicleService.DeleteAsync(id);
            return NoContent();
        }
    }
}
