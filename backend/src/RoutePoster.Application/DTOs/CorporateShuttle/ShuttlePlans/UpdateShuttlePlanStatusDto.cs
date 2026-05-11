namespace RoutePoster.Application.DTOs.CorporateShuttle.ShuttlePlans
{
    public class UpdateShuttlePlanStatusDto
    {
        public string Statu { get; set; } = null!; // e.g. "Plan Gonderildi", "Onaylandi", "Reddedildi"
    }
}
