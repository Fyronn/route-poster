using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TbltripAssignment
{
    public int Id { get; set; }

    public int TripId { get; set; }

    public int VehicleId { get; set; }

    public int DriverId { get; set; }

    public int? ServiceSupervisorId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tbluser Driver { get; set; } = null!;

    public virtual Tbluser? ServiceSupervisor { get; set; }

    public virtual Tbltrip Trip { get; set; } = null!;

    public virtual Tblvehicle Vehicle { get; set; } = null!;
}
