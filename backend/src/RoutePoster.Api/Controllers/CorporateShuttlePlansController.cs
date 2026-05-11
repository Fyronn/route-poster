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
            // Senaryo: Şirket yöneticisi planı ABC Turizm'e gönderiyor.
            // Bu client'a ait statüsü "Talep Edildi" olan rotaları "Plan Gönderildi" olarak güncelliyoruz.
            var requests = await _routeRequestService.GetByClientIdAsync(clientId);
            foreach (var req in requests)
            {
                if (req.Statu == "Talep Edildi")
                {
                    await _routeRequestService.UpdateStatusAsync(req.RotaId, "Plan Gönderildi");
                }
            }

            return Ok(new { Message = "Plan başarıyla ABC Turizm'e gönderildi." });
        }
    }
}
