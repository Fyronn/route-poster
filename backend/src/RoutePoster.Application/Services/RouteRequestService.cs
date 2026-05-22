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
            var entities = await _routeRequestRepository.GetAllWithDetailsAsync();
            return entities.Where(r => r.Status == "Requested" || r.Status == "Approved" || r.Status == "Rejected").Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetByClientIdAsync(int clientId)
        {
            var entities = await _routeRequestRepository.GetByClientIdWithDetailsAsync(clientId);
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetApprovedByClientIdAsync(int clientId)
        {
            var entities = await _routeRequestRepository.GetByClientIdWithDetailsAsync(clientId);
            return entities.Where(r => r.Status == "Approved").Select(MapToDto);
        }

        public async Task<RouteRequestDto?> GetByIdAsync(int id)
        {
            var entity = await _routeRequestRepository.GetByIdWithDetailsAsync(id);
            if (entity == null) return null;
            return MapToDto(entity);
        }

        public async Task<IEnumerable<RouteStopDto>?> GetRouteStopsAsync(int routeId)
        {
            var entity = await _routeRequestRepository.GetByIdWithDetailsAsync(routeId);
            if (entity == null) return null;

            return entity.TblrouteStops.Select(s => new RouteStopDto
            {
                StopId = s.StopId,
                StopName = s.Stop?.StopName ?? "Unknown",
                StopOrder = s.StopOrder
            }).OrderBy(s => s.StopOrder).ToList();
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
            
            // 1. Durakları Sırasıyla Ekle
            if (dto.StopIds != null && dto.StopIds.Any())
            {
                for (int i = 0; i < dto.StopIds.Count; i++)
                {
                    entity.TblrouteStops.Add(new TblrouteStop
                    {
                        StopId = dto.StopIds[i],
                        StopOrder = i + 1,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // 2. Yolcuları Rotaya Ata
            if (dto.PassengerIds != null && dto.PassengerIds.Any())
            {
                foreach (var passengerId in dto.PassengerIds)
                {
                    entity.TblpassengerRoutePreferences.Add(new TblpassengerRoutePreference
                    {
                        PassengerId = passengerId,
                        IsDefault = true,
                        PickupStopId = dto.StopIds?.FirstOrDefault() ?? 0,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _routeRequestRepository.AddAsync(entity);
            await _routeRequestRepository.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task UpdateStatusAsync(int id, string status, string? rejectedReason = null)
        {
            var entity = await _routeRequestRepository.GetByIdAsync(id);
            if (entity != null)
            {
                entity.Status = status;
                if (!string.IsNullOrEmpty(rejectedReason))
                {
                    entity.RejectionReason = rejectedReason;
                }
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
                IsActive = entity.IsActive,
                RejectionReason = entity.RejectionReason,
                Stops = entity.TblrouteStops.Select(s => new RouteStopDto
                {
                    StopId = s.StopId,
                    StopName = s.Stop?.StopName ?? "Unknown",
                    StopOrder = s.StopOrder
                }).OrderBy(s => s.StopOrder).ToList(),
                Passengers = entity.TblpassengerRoutePreferences.Select(p => new RoutePassengerDto
                {
                    PassengerId = p.PassengerId,
                    FullName = p.Passenger != null ? $"{p.Passenger.FirstName} {p.Passenger.LastName}" : "Unknown"
                }).ToList()
            };
        }
    }
}
