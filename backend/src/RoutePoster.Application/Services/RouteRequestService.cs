using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class RouteRequestService : IRouteRequestService
    {
        private readonly IRouteRequestRepository _routeRequestRepository;

        public RouteRequestService(IRouteRequestRepository routeRequestRepository)
        {
            _routeRequestRepository = routeRequestRepository;
        }

        public async Task<IEnumerable<RouteRequestDto>> GetAllAsync()
        {
            var entities = await _routeRequestRepository.GetAllAsync();
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetByClientIdAsync(int clientId)
        {
            var entities = await _routeRequestRepository.FindAsync(r => r.ClientId == clientId);
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetApprovedByClientIdAsync(int clientId)
        {
            var entities = await _routeRequestRepository.FindAsync(r => r.ClientId == clientId && r.Status == "Approved");
            return entities.Select(MapToDto);
        }

        public async Task<RouteRequestDto?> GetByIdAsync(int id)
        {
            var entity = await _routeRequestRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<RouteRequestDto> CreateAsync(CreateRouteRequestDto dto)
        {
            var entity = new Tblroute
            {
                ClientId = dto.ClientId ?? 1,
                RouteName = dto.RouteName ?? string.Empty,
                ShiftType = dto.ShiftType,
                Direction = dto.Direction,
                OperatingDays = dto.OperatingDays,
                PlannedStartTime = dto.PlannedStartTime ?? new TimeOnly(0, 0),
                Status = "Requested",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _routeRequestRepository.AddAsync(entity);
            await _routeRequestRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateStatusAsync(int id, string status)
        {
            var entity = await _routeRequestRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.Status = status;
                _routeRequestRepository.Update(entity);
                await _routeRequestRepository.SaveChangesAsync();
            }
        }

        private RouteRequestDto MapToDto(Tblroute entity)
        {
            return new RouteRequestDto
            {
                RouteId = entity.Id,
                ClientId = entity.ClientId,
                RouteName = entity.RouteName,
                Status = entity.Status,
                ShiftType = entity.ShiftType,
                Direction = entity.Direction,
                OperatingDays = entity.OperatingDays,
                PlannedStartTime = entity.PlannedStartTime,
                EstimatedDurationMinutes = entity.EstimatedDurationMinutes,
                IsActive = entity.IsActive
            };
        }
    }
}
