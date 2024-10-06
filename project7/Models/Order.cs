using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class Order
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Status { get; set; }

    public int? LoyaltyPoints { get; set; }

    public string? TransactionId { get; set; }

    public int? ProductId { get; set; }

    public int? Quantity { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Product? Product { get; set; }

    public virtual User? User { get; set; }

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
