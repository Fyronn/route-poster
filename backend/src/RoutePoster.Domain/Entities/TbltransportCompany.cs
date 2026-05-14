using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TbltransportCompany
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? TaxNumber { get; set; }

    public string? ContactPerson { get; set; }

    public string? ContactPhone { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual ICollection<Tblclient> Tblclients { get; set; } = new List<Tblclient>();

    public virtual ICollection<Tblstop> Tblstops { get; set; } = new List<Tblstop>();

    public virtual ICollection<Tbluser> Tblusers { get; set; } = new List<Tbluser>();

    public virtual ICollection<Tblvehicle> Tblvehicles { get; set; } = new List<Tblvehicle>();
}
