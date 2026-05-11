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

        [HttpPost]
        public async Task<ActionResult<RouteRequestDto>> Create([FromBody] CreateRouteRequestDto dto)
        {
            var createdRoute = await _routeRequestService.CreateAsync(dto);
            return Ok(createdRoute);
        }
    }
}
