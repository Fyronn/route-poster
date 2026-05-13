namespace RoutePoster.Application.DTOs.Clients
{
    public class UpdateClientDto
    {
        public string ClientName { get; set; } = null!;
        public string? ClientType { get; set; }
        public string? TaxNumber { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public bool? IsActive { get; set; }
        
        // Extra fields from UI (not in DB)
        public string? AuthorizedPerson { get; set; } 
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? SetupPreference { get; set; }
    }
}
