using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblpassengerAbsence
{
    public int Id { get; set; }

    public int PassengerId { get; set; }

    public int RouteId { get; set; }

    public DateOnly AbsenceDate { get; set; }

    public DateTime? NotificationTime { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tbluser Passenger { get; set; } = null!;

    public virtual Tblroute Route { get; set; } = null!;
}
