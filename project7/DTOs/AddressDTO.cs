namespace project7.DTOs
{
    public class AddressDTO
    {
        public int? UserId { get; set; }

        public string AddressLine { get; set; } = null!;

        public string? City { get; set; }

        public string? Country { get; set; }

        public string? PostalCode { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
