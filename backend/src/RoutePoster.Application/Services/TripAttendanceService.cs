using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoutePoster.Application.DTOs.TripAttendances;
using RoutePoster.Application.Services.Interfaces;
using RoutePoster.Domain.Entities;
using RoutePoster.Domain.Interfaces;

namespace RoutePoster.Application.Services
{
    public class TripAttendanceService : ITripAttendanceService
    {
        private readonly ITripAttendanceRepository _repository;

        public TripAttendanceService(ITripAttendanceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TripAttendanceDto>> GetAllAsync()
        {
            var attendances = await _repository.GetAllAsync();
            return attendances.Select(a => new TripAttendanceDto
            {
                Id = a.Id,
                TripId = a.TripId,
                PassengerId = a.PassengerId,
                StopId = a.StopId,
                AttendanceStatus = a.AttendanceStatus,
                ActionTime = a.ActionTime,
                ActionByUserId = a.ActionByUserId,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                CreatedBy = a.CreatedBy
            });
        }

        public async Task<TripAttendanceDto?> GetByIdAsync(int id)
        {
            var attendance = await _repository.GetByIdAsync(id);
            if (attendance == null) return null;

            return new TripAttendanceDto
            {
                Id = attendance.Id,
                TripId = attendance.TripId,
                PassengerId = attendance.PassengerId,
                StopId = attendance.StopId,
                AttendanceStatus = attendance.AttendanceStatus,
                ActionTime = attendance.ActionTime,
                ActionByUserId = attendance.ActionByUserId,
                CreatedAt = attendance.CreatedAt,
                UpdatedAt = attendance.UpdatedAt,
                CreatedBy = attendance.CreatedBy
            };
        }

        public async Task<TripAttendanceDto> CreateAsync(CreateTripAttendanceDto dto)
        {
            var attendance = new TbltripAttendance
            {
                TripId = dto.TripId,
                PassengerId = dto.PassengerId,
                StopId = dto.StopId,
                AttendanceStatus = dto.AttendanceStatus,
                ActionTime = dto.ActionTime,
                ActionByUserId = dto.ActionByUserId,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(attendance);
            await _repository.SaveChangesAsync();

            return new TripAttendanceDto
            {
                Id = attendance.Id,
                TripId = attendance.TripId,
                PassengerId = attendance.PassengerId,
                StopId = attendance.StopId,
                AttendanceStatus = attendance.AttendanceStatus,
                ActionTime = attendance.ActionTime,
                ActionByUserId = attendance.ActionByUserId,
                CreatedAt = attendance.CreatedAt,
                UpdatedAt = attendance.UpdatedAt,
                CreatedBy = attendance.CreatedBy
            };
        }

        public async Task UpdateAsync(int id, UpdateTripAttendanceDto dto)
        {
            var attendance = await _repository.GetByIdAsync(id);
            if (attendance != null)
            {
                attendance.TripId = dto.TripId;
                attendance.PassengerId = dto.PassengerId;
                attendance.StopId = dto.StopId;
                attendance.AttendanceStatus = dto.AttendanceStatus;
                attendance.ActionTime = dto.ActionTime;
                attendance.ActionByUserId = dto.ActionByUserId;
                attendance.UpdatedAt = DateTime.UtcNow;

                _repository.Update(attendance);
                await _repository.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var attendance = await _repository.GetByIdAsync(id);
            if (attendance != null)
            {
                _repository.Remove(attendance);
                await _repository.SaveChangesAsync();
            }
        }
    }
}
