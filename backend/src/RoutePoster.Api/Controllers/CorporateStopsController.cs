using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoutePoster.Application.DTOs.CorporateShuttle.Stops;
using RoutePoster.Application.Services.Interfaces;

namespace RoutePoster.Api.Controllers
{
    [ApiController]
    [Route("api/corporate-shuttle/clients/{clientId}/stops")]
    public class CorporateStopsController : ControllerBase
    {
        private readonly IStopRequestService _stopRequestService;

        public CorporateStopsController(IStopRequestService stopRequestService)
        {
            _stopRequestService = stopRequestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StopRequestDto>>> GetByClientId(int clientId)
        {
            var stops = await _stopRequestService.GetByClientIdAsync(clientId);
            return Ok(stops);
        }

        [HttpPost]
        public async Task<ActionResult<StopRequestDto>> Create(int clientId, [FromBody] CreateStopRequestDto dto)
        {
            dto.KurumId = clientId;
            var createdStop = await _stopRequestService.CreateAsync(dto);
            return Ok(createdStop);
        }
    }
}
