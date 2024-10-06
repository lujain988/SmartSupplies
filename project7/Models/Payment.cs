using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int? OrderId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal PaymentAmount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentStatus { get; set; }

    public string? TransactionId { get; set; }

    public virtual Order? Order { get; set; }
}
