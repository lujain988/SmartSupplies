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
                    Price = x.Product.Price - (x.Product.Price * x.Product.Discount / 100)
                }
            }).ToList();

            return Ok(product);
        }






        [HttpPost]
        public IActionResult AddToCart([FromBody] AddToCart cart)
        {
            var product = _Db.Products.FirstOrDefault(p => p.Id == cart.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            // Calculate price after discount
            decimal priceAfterDiscount;
            if (product.Discount.HasValue && product.Discount.Value > 0)
            {
                decimal discountPercentage = product.Discount.Value / 100;
                priceAfterDiscount = product.Price - (product.Price * discountPercentage);
            }
            else
            {
                priceAfterDiscount = product.Price;
            }

            var existingCartItem = _Db.Carts
                                      .FirstOrDefault(c => c.UserId == cart.UserId && c.ProductId == cart.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += 1;
                existingCartItem.Price = priceAfterDiscount; // Update the price in case of discount change
                _Db.Carts.Update(existingCartItem);
            }
            else
            {
                var newCartItem = new Cart
                {
                    UserId = cart.UserId,
                    ProductId = cart.ProductId,
                    Quantity = 1,
                    Price = priceAfterDiscount // Set the price after applying discount or regular price
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

        [HttpPut("cartitem/updateMulti")]
        public IActionResult UpdateCartItems([FromBody] List<updateCartDTOs> cartItems)
        {
            foreach (var item in cartItems)
            {
                var cart = _Db.Carts.FirstOrDefault(c => c.UserId == item.UserId && c.ProductId == item.ProductId);

                if (cart != null)
                {
                    cart.Quantity = item.Quantity;
                    _Db.Carts.Update(cart);
                }
                else
                {
                    var newCartItem = new Cart
                    {
                        UserId = item.UserId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    };

                    _Db.Carts.Add(newCartItem);
                }
            }

            _Db.SaveChanges();
            return Ok(cartItems);
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


        [HttpGet("cartItemsSum/{id}")]
        public IActionResult cartItemsSum(int id)
        {
            var count = _Db.Carts.Where(c => c.UserId == id).Count();
            return Ok(count);
        }

    }
}

