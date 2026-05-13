using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class Tblrole
{
    public int Id { get; set; }

    public string RoleCode { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual ICollection<Tbluser> Tblusers { get; set; } = new List<Tbluser>();
}
