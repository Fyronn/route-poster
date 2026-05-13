using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class Tbluser
{
    public int Id { get; set; }

    public int? TransportCompanyId { get; set; }

    public int? ClientId { get; set; }

    public int? DepartmentId { get; set; }

    public int RoleId { get; set; }

    public string? IdentityNumber { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? PasswordHash { get; set; }

    public string? DeviceToken { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public virtual Tblclient? Client { get; set; }

    public virtual TblclientDepartment? Department { get; set; }

    public virtual Tblrole Role { get; set; } = null!;

    public virtual ICollection<TblpassengerAbsence> TblpassengerAbsences { get; set; } = new List<TblpassengerAbsence>();

    public virtual ICollection<TblpassengerRoutePreference> TblpassengerRoutePreferences { get; set; } = new List<TblpassengerRoutePreference>();

    public virtual ICollection<TbltripAssignment> TbltripAssignmentDrivers { get; set; } = new List<TbltripAssignment>();

    public virtual ICollection<TbltripAssignment> TbltripAssignmentServiceSupervisors { get; set; } = new List<TbltripAssignment>();

    public virtual ICollection<TbltripAttendance> TbltripAttendanceActionByUsers { get; set; } = new List<TbltripAttendance>();

    public virtual ICollection<TbltripAttendance> TbltripAttendancePassengers { get; set; } = new List<TbltripAttendance>();

    public virtual TbltransportCompany? TransportCompany { get; set; }
}
