using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardStatsticController : ControllerBase
    {

        private readonly MyDbContext _db;
        public AdminDashboardStatsticController(MyDbContext db)

        {
            _db = db;

        }

        [HttpGet("users/total")]
        public IActionResult GetTotalUsers()
        {
            var totalUsers = _db.Users.Count();
            return Ok(totalUsers);
        }

        [HttpGet("orders/total")]
        public IActionResult GetTotalOrders()
        {
            var totalOrders = _db.Orders.Count();
            return Ok(totalOrders);
        }
        [HttpGet("CategoryProductCount")]
        public IActionResult GetCategoryProductCount()
        {
            var productCount = _db.Categories
                .GroupJoin(_db.Products,
                    category => category.Id,
                    product => product.CategoryId,
                    (category, products) => new {
                        CategoryName = category.CategoryName,
                        ProductCount = products.Count()
                    })
                .ToList();

            return Ok(productCount);
        }


        [HttpGet("GetActiveVouchers")]
        public IActionResult GetActiveVouchers()
        {
            var activeVouchers = _db.Vouchers.Where(v => v.IsActive == true).ToList();

            return Ok(activeVouchers);
        }

    }



}