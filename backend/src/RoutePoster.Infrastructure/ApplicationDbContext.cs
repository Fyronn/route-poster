using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RoutePoster.Domain.Entities;

namespace RoutePoster.Infrastructure;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Tblclient> Tblclients { get; set; }

    public virtual DbSet<TblclientDepartment> TblclientDepartments { get; set; }

    public virtual DbSet<TblpassengerAbsence> TblpassengerAbsences { get; set; }

    public virtual DbSet<TblpassengerRoutePreference> TblpassengerRoutePreferences { get; set; }

    public virtual DbSet<TblpassengerTemporaryPreference> TblpassengerTemporaryPreferences { get; set; }

    public virtual DbSet<Tblrole> Tblroles { get; set; }

    public virtual DbSet<Tblroute> Tblroutes { get; set; }

    public virtual DbSet<TblrouteStop> TblrouteStops { get; set; }

    public virtual DbSet<Tblstop> Tblstops { get; set; }

    public virtual DbSet<TbltransportCompany> TbltransportCompanies { get; set; }

    public virtual DbSet<Tbltrip> Tbltrips { get; set; }

    public virtual DbSet<TbltripAssignment> TbltripAssignments { get; set; }

    public virtual DbSet<TbltripAttendance> TbltripAttendances { get; set; }

    public virtual DbSet<Tbluser> Tblusers { get; set; }

    public virtual DbSet<Tblvehicle> Tblvehicles { get; set; }

    public virtual DbSet<TblvehicleLocation> TblvehicleLocations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=192.168.1.40;Database=ServisDB2;User Id=sa;Password=melih123;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tblclient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLClien__3214EC07D9BF0E66");

            entity.ToTable("TBLClients");

            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.ClientName).HasMaxLength(150);
            entity.Property(e => e.ClientType).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.District).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Sector).HasMaxLength(100);
            entity.Property(e => e.TaxNumber).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.TransportCompany).WithMany(p => p.Tblclients)
                .HasForeignKey(d => d.TransportCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKClientsTransportCompany");
        });

        modelBuilder.Entity<TblclientDepartment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLClien__3214EC07A579A6E0");

            entity.ToTable("TBLClientDepartments");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DepartmentName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.TblclientDepartments)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKClientDepartmentsClient");
        });

        modelBuilder.Entity<TblpassengerAbsence>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLPasse__3214EC07191D2286");

            entity.ToTable("TBLPassengerAbsences");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.NotificationTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Passenger).WithMany(p => p.TblpassengerAbsences)
                .HasForeignKey(d => d.PassengerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPassengerAbsencesPassenger");

            entity.HasOne(d => d.Route).WithMany(p => p.TblpassengerAbsences)
                .HasForeignKey(d => d.RouteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPassengerAbsencesRoute");
        });

        modelBuilder.Entity<TblpassengerRoutePreference>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLPasse__3214EC07D988271E");

            entity.ToTable("TBLPassengerRoutePreferences");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDefault).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.DropoffStop).WithMany(p => p.TblpassengerRoutePreferenceDropoffStops)
                .HasForeignKey(d => d.DropoffStopId)
                .HasConstraintName("FKPassengerRoutePreferencesDropoffStop");

            entity.HasOne(d => d.Passenger).WithMany(p => p.TblpassengerRoutePreferences)
                .HasForeignKey(d => d.PassengerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPassengerRoutePreferencesPassenger");

            entity.HasOne(d => d.PickupStop).WithMany(p => p.TblpassengerRoutePreferencePickupStops)
                .HasForeignKey(d => d.PickupStopId)
                .HasConstraintName("FKPassengerRoutePreferencesPickupStop");

            entity.HasOne(d => d.Route).WithMany(p => p.TblpassengerRoutePreferences)
                .HasForeignKey(d => d.RouteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPassengerRoutePreferencesRoute");
        });

        modelBuilder.Entity<TblpassengerTemporaryPreference>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLPasse__3214EC077B537CDD");

            entity.ToTable("TBLPassengerTemporaryPreferences");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.DropoffStop).WithMany(p => p.TblpassengerTemporaryPreferenceDropoffStops)
                .HasForeignKey(d => d.DropoffStopId)
                .HasConstraintName("FK_TempPref_DropoffStop");

            entity.HasOne(d => d.Passenger).WithMany(p => p.TblpassengerTemporaryPreferences)
                .HasForeignKey(d => d.PassengerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TempPref_Passenger");

            entity.HasOne(d => d.PickupStop).WithMany(p => p.TblpassengerTemporaryPreferencePickupStops)
                .HasForeignKey(d => d.PickupStopId)
                .HasConstraintName("FK_TempPref_PickupStop");

            entity.HasOne(d => d.Route).WithMany(p => p.TblpassengerTemporaryPreferences)
                .HasForeignKey(d => d.RouteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TempPref_Route");
        });

        modelBuilder.Entity<Tblrole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLRoles__3214EC0717BC6005");

            entity.ToTable("TBLRoles");

            entity.HasIndex(e => e.RoleCode, "UQ__TBLRoles__D62CB59C99651FDC").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleCode).HasMaxLength(50);
            entity.Property(e => e.RoleName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Tblroute>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLRoute__3214EC07446714F9");

            entity.ToTable("TBLRoutes");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Direction).HasMaxLength(20);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.OperatingDays).HasMaxLength(50);
            entity.Property(e => e.RouteName).HasMaxLength(150);
            entity.Property(e => e.ShiftType).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Active");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Tblroutes)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKRoutesClient");
        });

        modelBuilder.Entity<TblrouteStop>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLRoute__3214EC07F3EB001C");

            entity.ToTable("TBLRouteStops");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DistanceFromPreviousKm).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Route).WithMany(p => p.TblrouteStops)
                .HasForeignKey(d => d.RouteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKRouteStopsRoute");

            entity.HasOne(d => d.Stop).WithMany(p => p.TblrouteStops)
                .HasForeignKey(d => d.StopId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKRouteStopsStop");
        });

        modelBuilder.Entity<Tblstop>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLStops__3214EC076961F56B");

            entity.ToTable("TBLStops");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Requested");
            entity.Property(e => e.StopName).HasMaxLength(150);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Tblstops)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FKStopsClient");

            entity.HasOne(d => d.MergedStop).WithMany(p => p.InverseMergedStop)
                .HasForeignKey(d => d.MergedStopId)
                .HasConstraintName("FKStopsMergedStop");

            entity.HasOne(d => d.TransportCompany).WithMany(p => p.Tblstops)
                .HasForeignKey(d => d.TransportCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKStopsTransportCompany");
        });

        modelBuilder.Entity<TbltransportCompany>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLTrans__3214EC07FCC87939");

            entity.ToTable("TBLTransportCompanies");

            entity.HasIndex(e => e.TaxNumber, "UQ__TBLTrans__34A7C179BF57BA86").IsUnique();

            entity.Property(e => e.CompanyName).HasMaxLength(150);
            entity.Property(e => e.ContactPerson).HasMaxLength(100);
            entity.Property(e => e.ContactPhone).HasMaxLength(20);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RegistrationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TaxNumber).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Tbltrip>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLTrips__3214EC07224F5697");

            entity.ToTable("TBLTrips");

            entity.Property(e => e.CompletedAt).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.StartedAt).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Planned");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Route).WithMany(p => p.Tbltrips)
                .HasForeignKey(d => d.RouteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripsRoute");
        });

        modelBuilder.Entity<TbltripAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLTripA__3214EC0748128057");

            entity.ToTable("TBLTripAssignments");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Driver).WithMany(p => p.TbltripAssignmentDrivers)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAssignmentsDriver");

            entity.HasOne(d => d.ServiceSupervisor).WithMany(p => p.TbltripAssignmentServiceSupervisors)
                .HasForeignKey(d => d.ServiceSupervisorId)
                .HasConstraintName("FKTripAssignmentsServiceSupervisor");

            entity.HasOne(d => d.Trip).WithMany(p => p.TbltripAssignments)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAssignmentsTrip");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.TbltripAssignments)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAssignmentsVehicle");
        });

        modelBuilder.Entity<TbltripAttendance>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLTripA__3214EC0739220F5D");

            entity.ToTable("TBLTripAttendance");

            entity.Property(e => e.ActionTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.AttendanceStatus).HasMaxLength(30);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.ActionByUser).WithMany(p => p.TbltripAttendanceActionByUsers)
                .HasForeignKey(d => d.ActionByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAttendanceActionByUser");

            entity.HasOne(d => d.Passenger).WithMany(p => p.TbltripAttendancePassengers)
                .HasForeignKey(d => d.PassengerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAttendancePassenger");

            entity.HasOne(d => d.Stop).WithMany(p => p.TbltripAttendances)
                .HasForeignKey(d => d.StopId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAttendanceStop");

            entity.HasOne(d => d.Trip).WithMany(p => p.TbltripAttendances)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTripAttendanceTrip");
        });

        modelBuilder.Entity<Tbluser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLUsers__3214EC07D2BBD9EA");

            entity.ToTable("TBLUsers");

            entity.HasIndex(e => e.Email, "UQ__TBLUsers__A9D1053445A0FC68").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeviceToken).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.IdentityNumber).HasMaxLength(20);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RegistrationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Tblusers)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FKUsersClient");

            entity.HasOne(d => d.Department).WithMany(p => p.Tblusers)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("FKUsersDepartment");

            entity.HasOne(d => d.Role).WithMany(p => p.Tblusers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKUsersRole");

            entity.HasOne(d => d.TransportCompany).WithMany(p => p.Tblusers)
                .HasForeignKey(d => d.TransportCompanyId)
                .HasConstraintName("FKUsersTransportCompany");
        });

        modelBuilder.Entity<Tblvehicle>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLVehic__3214EC074BBC7579");

            entity.ToTable("TBLVehicles");

            entity.HasIndex(e => e.PlateNumber, "UQ__TBLVehic__03692624A7F7B606").IsUnique();

            entity.Property(e => e.BrandModel).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EquipmentFeatures).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PlateNumber).HasMaxLength(20);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.VehicleType).HasMaxLength(50);

            entity.HasOne(d => d.TransportCompany).WithMany(p => p.Tblvehicles)
                .HasForeignKey(d => d.TransportCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKVehiclesTransportCompany");
        });

        modelBuilder.Entity<TblvehicleLocation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TBLVehic__3214EC07ECB8C6B5");

            entity.ToTable("TBLVehicleLocations");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.RecordedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Trip).WithMany(p => p.TblvehicleLocations)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKVehicleLocationsTrip");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.TblvehicleLocations)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKVehicleLocationsVehicle");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
