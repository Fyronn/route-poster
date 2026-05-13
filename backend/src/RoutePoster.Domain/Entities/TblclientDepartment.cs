using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TblclientDepartment
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblclient Client { get; set; } = null!;

    public virtual ICollection<Tbluser> Tblusers { get; set; } = new List<Tbluser>();
}
