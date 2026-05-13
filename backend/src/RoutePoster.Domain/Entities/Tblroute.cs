using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class Tblroute
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public string RouteName { get; set; } = null!;

    public string? Direction { get; set; }

    public string? ShiftType { get; set; }

    public TimeOnly PlannedStartTime { get; set; }

    public int? EstimatedDurationMinutes { get; set; }

    public string? OperatingDays { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedDate { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblclient Client { get; set; } = null!;

    public virtual ICollection<TblpassengerAbsence> TblpassengerAbsences { get; set; } = new List<TblpassengerAbsence>();

    public virtual ICollection<TblpassengerRoutePreference> TblpassengerRoutePreferences { get; set; } = new List<TblpassengerRoutePreference>();

    public virtual ICollection<TblrouteStop> TblrouteStops { get; set; } = new List<TblrouteStop>();

    public virtual ICollection<Tbltrip> Tbltrips { get; set; } = new List<Tbltrip>();
}
