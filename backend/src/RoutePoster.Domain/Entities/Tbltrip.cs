using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class Tbltrip
{
    public int Id { get; set; }

    public int RouteId { get; set; }

    public DateOnly TripDate { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblroute Route { get; set; } = null!;

    public virtual ICollection<TbltripAssignment> TbltripAssignments { get; set; } = new List<TbltripAssignment>();

    public virtual ICollection<TbltripAttendance> TbltripAttendances { get; set; } = new List<TbltripAttendance>();

    public virtual ICollection<TblvehicleLocation> TblvehicleLocations { get; set; } = new List<TblvehicleLocation>();
}
