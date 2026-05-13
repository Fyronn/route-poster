using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TbltripAttendance
{
    public int Id { get; set; }

    public int TripId { get; set; }

    public int PassengerId { get; set; }

    public int StopId { get; set; }

    public string? AttendanceStatus { get; set; }

    public DateTime? ActionTime { get; set; }

    public int ActionByUserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tbluser ActionByUser { get; set; } = null!;

    public virtual Tbluser Passenger { get; set; } = null!;

    public virtual Tblstop Stop { get; set; } = null!;

    public virtual Tbltrip Trip { get; set; } = null!;
}
