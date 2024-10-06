using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[]? PasswordHash { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public string? Role { get; set; }

    public int? LoyaltyPoints { get; set; }

    public bool? IsAdmin { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<ContactU> ContactUs { get; set; } = new List<ContactU>();

    public virtual ICollection<LoyaltyPoint> LoyaltyPointsNavigation { get; set; } = new List<LoyaltyPoint>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
