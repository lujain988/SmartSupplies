using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project7.DTO;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly MyDbContext _db;
        public OrderController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("GetCart/{id}")]
        public ActionResult GetCartByUserId(int id)
        {
            var showcart = _db.Carts.Where(x => x.UserId == id).Select(x =>
            new CartRequestDTO
            {
                UserId = x.UserId,
                ProductId = x.ProductId,
                Quantity = x.Quantity,
                ProductDTO = new ProductDTOs
                {
                    ProductName = x.Product.ProductName,
                    Price = x.Product.Price
                }

            }).ToList();

            return Ok(showcart);

        }
        [HttpPost("GetUserAddress")]
        public IActionResult GetUserAddress([FromForm] AddressDTO addressDTO)
        {
            var address = new Address
            {
                UserId = addressDTO.UserId,
                AddressLine = addressDTO.AddressLine,
                City = addressDTO.City,
                Country = addressDTO.Country,
                PhoneNumber = addressDTO.PhoneNumber,
                PostalCode = addressDTO.PostalCode
            };
            _db.Addresses.Add(address);
            _db.SaveChanges();
            return Ok();

        }
        [HttpGet("getaddress/{id}")]
        public ActionResult GetUserAddress(int id)
        {
            var userAddress = _db.Addresses.FirstOrDefault(x => x.UserId == id);
            if (userAddress == null)
            {
                return NotFound("User Address not found");
            }
            return Ok(userAddress);
        }
        [HttpGet("GetAllOrdersByUserEmail/{email}")]
        public IActionResult GetAllOrders(string email)
        {
            var user = _db.Users.FirstOrDefault(x => x.Email == email);
            var orders = _db.Orders.Where(x => x.UserId == user.Id).Select(m =>
             new OrderDTO
             {
                 Id = m.Id,
                 OrderDate = m.OrderDate,
                 TotalAmount = m.TotalAmount,
                 Status = m.Status,
                 LoyaltyPoints = m.LoyaltyPoints,
                 Quantity = m.Quantity,

                 ProductOrderDTO = new ProductOrderDTO
                 {
                     ProductName = m.Product.ProductName,
                     Price = m.Product.Price,
                 },
                 UserOrderDTO = new UserOrderDTO
                 {
                     Username = m.User.Username,
                 },
                 Vouchers = new VoucherOrderDTO
                 {
                     Code = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().Code,
                     DiscountAmount = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().DiscountAmount,

                 },

             });
            return Ok(orders);
        }


        [HttpGet("GetAllOrdersByUserId/{id}")]
        public IActionResult GetAllOrderss(int id)
        {
          
            var orders = _db.Orders.Where(x => x.UserId == id).Select(m =>
             new OrderDTO
             {
                 Id = m.Id,
                 OrderDate = m.OrderDate,
                 TotalAmount = m.TotalAmount,
                 Status = m.Status,
                 LoyaltyPoints = m.LoyaltyPoints,
                 Quantity = m.Quantity,

                 ProductOrderDTO = new ProductOrderDTO
                 {
                     ProductName = m.Product.ProductName,
                     Price = m.Product.Price,
                 },
                 UserOrderDTO = new UserOrderDTO
                 {
                     Username = m.User.Username,
                 },
                 Vouchers = new VoucherOrderDTO
                 {
                     Code = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().Code,
                     DiscountAmount = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().DiscountAmount,

                 },

             });
            return Ok(orders);
        }


        [HttpGet("/AllOrders/")]
        public IActionResult GetAllOrders()
        {
            var orders = _db.Orders.Join(_db.Users,
                 o => o.UserId,
                 u => u.Id,
                 (o, u) => new {
                     id = o.Id,
                     Username = u.Username,
                     Email = u.Email,
                     Status = o.Status,
                     TotalAmount = o.TotalAmount,
                     OrderDate = o.OrderDate


                 }).OrderBy(r =>
                 r.Status == "Pending" ? 0 :
                 r.Status == "Shipped" ? 1 :
                 r.Status == "Delivered" ? 2 :
                 3).ToList();

            return Ok(orders);
        }
        [HttpPost("AddNewOrderByUserId")]
        public IActionResult AddNewOrder([FromBody] AddNewOrderByUserId addNewOrderByUserId)
        {
            var cart = _db.Carts.Where(c => c.UserId == addNewOrderByUserId.Id).ToList();

            foreach (var item in cart)
            {

                var productPrice = _db.Products.Where(p => p.Id == item.ProductId).Select(p => p.Price).FirstOrDefault();
                var order = new Order
                {
                    UserId = addNewOrderByUserId.Id,
                    OrderDate = DateTime.Now,
                    TotalAmount = item.Quantity * productPrice,
                    Status = "Pending",
                    LoyaltyPoints = 0,
                    TransactionId = "M123",
                    Quantity = item.Quantity,
                    ProductId = item.ProductId,


                };
                _db.Orders.Add(order);
                _db.SaveChanges();

            }
            return Ok(cart);
        }
        [HttpGet("GetLastOrderIdByUserId/{id}")]
        public IActionResult GetLastOrderIdByUserId(int id)
        {
            var lastorder = _db.Orders.Where(k => k.UserId == id).OrderByDescending(k => k.OrderDate).FirstOrDefault();
            return Ok(lastorder);
        }


        [HttpGet("GetAllOrdersByOrderDate/{orderdate}")]
        public IActionResult GetOrdersByOrderDate(DateTime orderdate)
        {
            var orders = _db.Orders.Where(x => EF.Functions.DateDiffDay(x.OrderDate, orderdate) == 0).Select(m =>
            new OrderDTO
            {
                Id = m.Id,
                OrderDate = m.OrderDate,
                TotalAmount = m.TotalAmount,
                Status = m.Status,
                LoyaltyPoints = m.LoyaltyPoints,
                Quantity = m.Quantity,

                ProductOrderDTO = new ProductOrderDTO
                {
                    ProductName = m.Product.ProductName,
                    Price = m.Product.Price,
                },
                UserOrderDTO = new UserOrderDTO
                {
                    Username = m.User.Username,
                },
                Vouchers = new VoucherOrderDTO
                {
                    Code = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().Code,
                    DiscountAmount = _db.Vouchers.Where(c => c.OrderId == m.Id).FirstOrDefault().DiscountAmount,
                }
            }).ToList();

            return Ok(orders);
        }

    }
}
