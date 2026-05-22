using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/service-routes")]
    public class ServiceRoutesController : ControllerBase
    {
        private readonly IRouteRequestService _routeRequestService;

        public ServiceRoutesController(IRouteRequestService routeRequestService)
        {
            _routeRequestService = routeRequestService;
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<RouteRequestDto>>> GetApprovedRoutesByClientId(int clientId)
        {
            // Onaylanmış rotalar (Service Routes) olarak listelenir
            var routes = await _routeRequestService.GetApprovedByClientIdAsync(clientId);
            return Ok(routes);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteRequestDto>>> GetAll()
        {
            var routes = await _routeRequestService.GetAllAsync();
            return Ok(routes);
        }

        [HttpGet("{routeId}")]
        public async Task<ActionResult<RouteRequestDto>> GetById(int routeId)
        {
            var route = await _routeRequestService.GetByIdAsync(routeId);
            if (route == null) return NotFound(new { Message = $"Route with ID {routeId} not found." });
            return Ok(route);
        }

        [HttpGet("{routeId}/stops")]
        public async Task<ActionResult<IEnumerable<RouteStopDto>>> GetRouteStops(int routeId)
        {
            var stops = await _routeRequestService.GetRouteStopsAsync(routeId);
            if (stops == null) return NotFound(new { Message = $"Route with ID {routeId} not found." });
            return Ok(stops);
        }

        [HttpPost]
        public async Task<ActionResult<RouteRequestDto>> Create([FromBody] CreateRouteRequestDto dto)
        {
            var createdRoute = await _routeRequestService.CreateAsync(dto);
            return Ok(createdRoute);
        }
    }
}
