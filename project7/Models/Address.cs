using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class Address
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string AddressLine { get; set; } = null!;

    public string? City { get; set; }

    public string? Country { get; set; }

    public string? PostalCode { get; set; }

    public string? PhoneNumber { get; set; }

    public virtual User? User { get; set; }
}
