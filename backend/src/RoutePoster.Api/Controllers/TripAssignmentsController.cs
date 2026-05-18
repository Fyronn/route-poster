using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.TripAssignments;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/trip-assignments")]
    public class TripAssignmentsController : ControllerBase
    {
        private readonly ITripAssignmentService _service;

        public TripAssignmentsController(ITripAssignmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripAssignmentDto>>> GetAll()
        {
            var assignments = await _service.GetAllAsync();
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TripAssignmentDto>> GetById(int id)
        {
            var assignment = await _service.GetByIdAsync(id);
            if (assignment == null) return NotFound();
            return Ok(assignment);
        }

        [HttpPost]
        public async Task<ActionResult<TripAssignmentDto>> Create([FromBody] CreateTripAssignmentDto dto)
        {
            var createdAssignment = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdAssignment.Id }, createdAssignment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTripAssignmentDto dto)
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
