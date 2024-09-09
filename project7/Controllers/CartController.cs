using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project7.DTO;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {


        private readonly MyDbContext _Db;
        public CartController(MyDbContext db)
        {
            _Db = db;
        }





        [HttpGet("getallitems/{id}")]
        public IActionResult Getallproduct(int id)
        {
            var product = _Db.Carts.Where(x => x.UserId == id).Select(x => new CartDTO
            {
                Id = x.Id,
                Quantity = x.Quantity,
                UserId = x.UserId,
                ProductId = x.ProductId,
                product = new ProductDTO
                {
                    ProductName = x.Product.ProductName,
                    Image = x.Product.Image,
                    Price = x.Product.Price,

                }

            });

            return Ok(product);
        }






        [HttpPost]
        public IActionResult AddToCart([FromBody] AddToCart cart)
        {
            var existingCartItem = _Db.Carts
                                     .FirstOrDefault(c => c.UserId == cart.UserId && c.ProductId == cart.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += 1;
                _Db.Carts.Update(existingCartItem);
            }
            else
            {
                var newCartItem = new Cart
                {
                    UserId = cart.UserId,
                    ProductId = cart.ProductId,
                    Quantity = 1
                };

                _Db.Carts.Add(newCartItem);
            }

            _Db.SaveChanges();

            return Ok(existingCartItem);
        }





        [HttpPut("cartitem/updateitem/{id}")]
        public IActionResult editproduct(int id, [FromBody] updateCartDTO obj)
        {
            var cart = _Db.Carts.Find(id);
            cart.Quantity = obj.Quantity;

            _Db.Update(cart);
            _Db.SaveChanges();
            return Ok();
        }





        [HttpDelete("cartitem/deletitem/{id}")]
        public IActionResult deleteitem(int id)
        {
            var item = _Db.Carts.Find(id);
            _Db.Remove(item);
            _Db.SaveChanges()
; return Ok();
        }


        [HttpGet("copon/{name}")]
        public IActionResult chickcopobn(string name)
        {
            var copon = _Db.Vouchers.SingleOrDefault(x => x.Code == name && x.ExpirationDate >= DateTime.Now && x.IsActive == true);
            if (copon == null)
                return NotFound();

            return Ok(copon);
        }


    }
}

