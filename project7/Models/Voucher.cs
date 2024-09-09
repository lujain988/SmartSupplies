using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class Voucher
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public decimal DiscountAmount { get; set; }

    public DateTime ExpirationDate { get; set; }

    public bool? IsActive { get; set; }

    public int? OrderId { get; set; }

    public virtual Order? Order { get; set; }
}
