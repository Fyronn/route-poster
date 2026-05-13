using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class Tblclient
{
    public int Id { get; set; }

    public int TransportCompanyId { get; set; }

    public string ClientName { get; set; } = null!;

    public string? ClientType { get; set; }

    public string? Sector { get; set; }

    public string? TaxNumber { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public DateOnly? ContractStartDate { get; set; }

    public DateOnly? ContractEndDate { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual ICollection<TblclientDepartment> TblclientDepartments { get; set; } = new List<TblclientDepartment>();

    public virtual ICollection<Tblroute> Tblroutes { get; set; } = new List<Tblroute>();

    public virtual ICollection<Tblstop> Tblstops { get; set; } = new List<Tblstop>();

    public virtual ICollection<Tbluser> Tblusers { get; set; } = new List<Tbluser>();

    public virtual TbltransportCompany TransportCompany { get; set; } = null!;
}
