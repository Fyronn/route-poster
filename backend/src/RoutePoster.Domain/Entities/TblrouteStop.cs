using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TblrouteStop
{
    public int Id { get; set; }

    public int RouteId { get; set; }

    public int StopId { get; set; }

    public int StopOrder { get; set; }

    public TimeOnly TargetArrivalTime { get; set; }

    public decimal? DistanceFromPreviousKm { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblroute Route { get; set; } = null!;

    public virtual Tblstop Stop { get; set; } = null!;
}
