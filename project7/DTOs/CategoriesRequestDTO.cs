namespace project7.DTOs
{
    public class CategoriesRequestDTO
    {
        public string CategoryName { get; set; } = null!;

        public string? Description { get; set; }

        public IFormFile? Image { get; set; }
    }
}
