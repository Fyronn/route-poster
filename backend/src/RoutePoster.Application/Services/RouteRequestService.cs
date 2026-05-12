using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.CorporateShuttle.RouteRequests;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Interfaces;
using RoutePoster.Infrastructure;

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

        public async Task<IEnumerable<RouteRequestDto>> GetByKurumIdAsync(int kurumId)
        {
            var entities = await _routeRequestRepository.FindAsync(r => r.KurumId == kurumId);
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetByClientIdAsync(int clientId)
        {
            var entities = await _routeRequestRepository.FindAsync(r => r.KurumId == clientId);
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<RouteRequestDto>> GetApprovedByClientIdAsync(int clientId)
        {
            // ABC Turizm tarafindan onaylanan ("Onaylandı") rotalar Service Route olarak listelenebilir.
            var entities = await _routeRequestRepository.FindAsync(r => r.KurumId == clientId && r.Statu == "Onaylandı");
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
            var entity = new TblRotalar
            {
                KurumId = dto.KurumId,
                RotaAdi = dto.RotaAdi ?? string.Empty,
                VardiyaTipi = dto.VardiyaTipi,
                Yon = dto.Yon,
                CalismaGunleri = dto.CalismaGunleri,
                PlanlananBaslangicSaati = dto.PlanlananBaslangicSaati ?? new TimeOnly(0, 0),
                Statu = "Talep Edildi",
                AktifMi = true,
                OlusturmaTarihi = DateTime.UtcNow
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
                entity.Statu = status;
                _routeRequestRepository.Update(entity);
                await _routeRequestRepository.SaveChangesAsync();
            }
        }

        private RouteRequestDto MapToDto(TblRotalar entity)
        {
            return new RouteRequestDto
            {
                RotaId = entity.RotaId,
                KurumId = entity.KurumId,
                RotaAdi = entity.RotaAdi,
                Statu = entity.Statu,
                VardiyaTipi = entity.VardiyaTipi,
                Yon = entity.Yon,
                CalismaGunleri = entity.CalismaGunleri,
                PlanlananBaslangicSaati = entity.PlanlananBaslangicSaati,
                TahminiSureDakika = entity.TahminiSureDakika,
                AktifMi = entity.AktifMi
            };
        }
    }
}
