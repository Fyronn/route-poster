using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/corporate-shuttle/clients/{clientId}/shuttle-plan")]
    public class CorporateShuttlePlansController : ControllerBase
    {
        private readonly IRouteRequestService _routeRequestService;

        public CorporateShuttlePlansController(IRouteRequestService routeRequestService)
        {
            _routeRequestService = routeRequestService;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitPlan(int clientId)
        {
            // Scenario: Company manager sends the plan to ABC Tourism.
            // We update the routes belonging to this client with status "Requested" to "Plan Sent".
            var requests = await _routeRequestService.GetByClientIdAsync(clientId);
            foreach (var req in requests)
            {
                if (req.Status == "Requested")
                {
                    await _routeRequestService.UpdateStatusAsync(req.RouteId, "Plan Sent");
                }
            }

            return Ok(new { Message = "Plan successfully sent to ABC Tourism." });
        }
    }
}
