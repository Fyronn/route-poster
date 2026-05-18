using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.TripAttendances;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/trip-attendances")]
    public class TripAttendancesController : ControllerBase
    {
        private readonly ITripAttendanceService _service;

        public TripAttendancesController(ITripAttendanceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripAttendanceDto>>> GetAll()
        {
            var attendances = await _service.GetAllAsync();
            return Ok(attendances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TripAttendanceDto>> GetById(int id)
        {
            var attendance = await _service.GetByIdAsync(id);
            if (attendance == null) return NotFound();
            return Ok(attendance);
        }

        [HttpPost]
        public async Task<ActionResult<TripAttendanceDto>> Create([FromBody] CreateTripAttendanceDto dto)
        {
            var createdAttendance = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdAttendance.Id }, createdAttendance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTripAttendanceDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
