using System;
using System.Collections.Generic;

namespace RoutePoster.Domain.Entities;

public partial class TblpassengerTemporaryPreference
{
    public int Id { get; set; }

    public int PassengerId { get; set; }

    public int RouteId { get; set; }

    public int? PickupStopId { get; set; }

    public int? DropoffStopId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Tblstop? DropoffStop { get; set; }

    public virtual Tbluser Passenger { get; set; } = null!;

    public virtual Tblstop? PickupStop { get; set; }

    public virtual Tblroute Route { get; set; } = null!;
}
