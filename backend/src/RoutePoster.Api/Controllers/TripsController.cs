using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.Trips;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripsController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripsController(ITripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetAll()
        {
            var trips = await _tripService.GetAllAsync();
            return Ok(trips);
        }

        [HttpGet("route/{routeId}")]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetByRouteId(int routeId)
        {
            var trips = await _tripService.GetByRouteIdAsync(routeId);
            return Ok(trips);
        }

        [HttpPost]
        public async Task<ActionResult<TripDto>> Create([FromBody] CreateTripDto dto)
        {
            var createdTrip = await _tripService.CreateAsync(dto);
            return Ok(createdTrip);
        }

        [HttpPost("{id}/start")]
        public async Task<ActionResult<TripDto>> StartTrip(int id, [FromBody] TripActionRequestDto request)
        {
            try
            {
                var result = await _tripService.StartTripAsync(id, request.DriverId);
                if (result == null) return NotFound(new { message = "Trip not found." });
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/end")]
        public async Task<ActionResult<TripDto>> EndTrip(int id, [FromBody] TripActionRequestDto request)
        {
            try
            {
                var result = await _tripService.EndTripAsync(id, request.DriverId);
                if (result == null) return NotFound(new { message = "Trip not found." });
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
