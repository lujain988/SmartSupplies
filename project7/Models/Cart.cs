using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class Cart
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User? User { get; set; }
}
