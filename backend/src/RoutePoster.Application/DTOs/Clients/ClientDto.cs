using System;

namespace RoutePoster.Application.DTOs.Clients
{
    public class ClientDto
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; } = null!;
        public string? ClientType { get; set; } // Transport Type (e.g. CorporateShuttle)
        public string? TaxNumber { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public bool? IsActive { get; set; }
        
        // Note: The following fields are not in the existing database but requested by frontend flow.
        // In a real DB-First scenario where DB isn't updated, they won't be saved or fetched unless mapped differently.
        public string? AuthorizedPerson { get; set; } 
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? SetupPreference { get; set; }
    }
}
