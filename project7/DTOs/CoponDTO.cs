namespace project7.DTO
{
    public class CoponDTO
    {

        public string Code { get; set; } = null!;

        public decimal DiscountAmount { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
