using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
using RoutePoster.Application.DTOs.CorporateShuttle.ShuttlePlans;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/shuttle-plan-requests")]
    public class ShuttlePlanRequestsController : ControllerBase
    {
        private readonly IRouteRequestService _routeRequestService;

        public ShuttlePlanRequestsController(IRouteRequestService routeRequestService)
        {
            _routeRequestService = routeRequestService;
        }

        [HttpPut("route/{routeId}/status")]
        public async Task<IActionResult> UpdateRouteStatus(int routeId, [FromBody] UpdateShuttlePlanStatusDto dto)
        {
            // ABC Turizm admini, gelen rotaları onaylar veya reddeder.
            await _routeRequestService.UpdateStatusAsync(routeId, dto.Statu);
            return Ok(new { Message = $"Rota statüsü '{dto.Statu}' olarak güncellendi." });
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RouteRequestDto>>> GetAll()
        {
            var requests = await _routeRequestService.GetAllAsync();
            return Ok(requests);
        }
    }
}
