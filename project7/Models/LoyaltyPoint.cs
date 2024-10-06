using System;
using System.Collections.Generic;

namespace project7.Models;

public partial class LoyaltyPoint
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int PointsEarned { get; set; }

    public int? PointsUsed { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
