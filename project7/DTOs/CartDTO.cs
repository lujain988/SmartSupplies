namespace project7.DTO
{
    public class CartDTO
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public int? ProductId { get; set; }

        public int Quantity { get; set; }
        public decimal? Price { get; set; }

        public ProductDTO product { get; set; }
    }

   public class ProductDTO
    {
        public string? Image { get; set; }
        public decimal? Price { get; set; }
        public string ProductName { get; set; }
    }
}

