using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class Tblstop
{
    public int Id { get; set; }

    public int TransportCompanyId { get; set; }

    public int? ClientId { get; set; }

    public string StopName { get; set; } = null!;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? Address { get; set; }

    public string? Status { get; set; }

    public int? MergedStopId { get; set; }

    public string? OperatorNote { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblclient? Client { get; set; }

    public virtual ICollection<Tblstop> InverseMergedStop { get; set; } = new List<Tblstop>();

    public virtual Tblstop? MergedStop { get; set; }

    public virtual ICollection<TblpassengerRoutePreference> TblpassengerRoutePreferenceDropoffStops { get; set; } = new List<TblpassengerRoutePreference>();

    public virtual ICollection<TblpassengerRoutePreference> TblpassengerRoutePreferencePickupStops { get; set; } = new List<TblpassengerRoutePreference>();

    public virtual ICollection<TblrouteStop> TblrouteStops { get; set; } = new List<TblrouteStop>();

    public virtual ICollection<TbltripAttendance> TbltripAttendances { get; set; } = new List<TbltripAttendance>();

    public virtual TbltransportCompany TransportCompany { get; set; } = null!;
}
