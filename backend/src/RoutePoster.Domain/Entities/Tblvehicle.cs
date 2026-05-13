using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class Tblvehicle
{
    public int Id { get; set; }

    public int TransportCompanyId { get; set; }

    public string PlateNumber { get; set; } = null!;

    public int Capacity { get; set; }

    public string? BrandModel { get; set; }

    public int? ProductionYear { get; set; }

    public string? VehicleType { get; set; }

    public string? EquipmentFeatures { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual ICollection<TbltripAssignment> TbltripAssignments { get; set; } = new List<TbltripAssignment>();

    public virtual ICollection<TblvehicleLocation> TblvehicleLocations { get; set; } = new List<TblvehicleLocation>();

    public virtual TbltransportCompany TransportCompany { get; set; } = null!;
}
