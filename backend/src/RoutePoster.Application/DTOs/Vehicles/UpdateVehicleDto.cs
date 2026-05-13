namespace RoutePoster.Application.DTOs.Vehicles
{
    public class UpdateVehicleDto
    {
        public string PlateNumber { get; set; } = null!;
        public int Capacity { get; set; }
        public string? BrandModel { get; set; }
        public int? ProductionYear { get; set; }
        public string? VehicleType { get; set; }
        public string? EquipmentFeatures { get; set; }
        public bool? IsActive { get; set; }
    }
}
