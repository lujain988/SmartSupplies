namespace project7.DTOs
{
    public class CartRequestDTO
    {
        public int? UserId { get; set; }

        public int? ProductId { get; set; }

        public int Quantity { get; set; }

        public virtual ProductDTOs? ProductDTO { get; set; }

    }
}
