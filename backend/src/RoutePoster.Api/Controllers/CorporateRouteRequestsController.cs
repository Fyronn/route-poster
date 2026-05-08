using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/corporate-shuttle/clients/{clientId}/route-requests")]
    public class CorporateRouteRequestsController : ControllerBase
    {
        private readonly IRouteRequestService _routeRequestService;

        public CorporateRouteRequestsController(IRouteRequestService routeRequestService)
        {
            _routeRequestService = routeRequestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteRequestDto>>> GetByClientId(int clientId)
        {
            var routeRequests = await _routeRequestService.GetByClientIdAsync(clientId);
            return Ok(routeRequests);
        }

        [HttpPost]
        public async Task<ActionResult<RouteRequestDto>> Create(int clientId, [FromBody] CreateRouteRequestDto dto)
        {
            dto.KurumId = clientId;
            var createdRequest = await _routeRequestService.CreateAsync(dto);
            return Ok(createdRequest);
        }
    }
}
