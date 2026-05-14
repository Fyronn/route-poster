using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TblvehicleLocation
{
    public long Id { get; set; }

    public int TripId { get; set; }

    public int VehicleId { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public int? SpeedKmh { get; set; }

    public DateTime? RecordedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tbltrip Trip { get; set; } = null!;

    public virtual Tblvehicle Vehicle { get; set; } = null!;
}
