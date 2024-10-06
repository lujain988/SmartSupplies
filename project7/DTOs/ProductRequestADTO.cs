namespace project7.DTOs
{
    public class ProductRequestADTO
    {
        public string ProductName { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public IFormFile? Image { get; set; }

        public decimal? Discount { get; set; }

    }
}
