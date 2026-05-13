namespace RoutePoster.Application.DTOs.Clients
{
    public class CreateClientDto
    {
        public string ClientName { get; set; } = null!;
        public string? ClientType { get; set; } // Transport Type
        public string? TaxNumber { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        
        // Fields not in DB but from UI
        public string? AuthorizedPerson { get; set; } 
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? SetupPreference { get; set; }
    }
}
