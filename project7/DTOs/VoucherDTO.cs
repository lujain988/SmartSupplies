using System.ComponentModel.DataAnnotations;

namespace project7.DTOs
{
    public class VoucherDTO
    {
        public string Code { get; set; } = null!;
        [Required]
        public decimal DiscountAmount { get; set; }
        [Required]
        public DateTime ExpirationDate { get; set; }

        public bool? IsActive { get; set; }
    }
}
