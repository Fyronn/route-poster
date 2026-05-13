namespace RoutePoster.Application.DTOs.CorporateShuttle.ShuttlePlans
{
    public class UpdateShuttlePlanStatusDto
    {
        public string Status { get; set; } = null!; // e.g. "Plan Sent", "Approved", "Rejected"
    }
}
