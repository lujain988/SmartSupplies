using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CategoriesController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("GetAllCategory")]
        public IActionResult GetAllCategory()
        {

            var categories = _db.Categories.ToList();
            return Ok(categories);


        }
        [HttpGet("CountAllCategory")]
        public IActionResult CountAllCategory()
        {

            var categories = _db.Categories.ToList().Count;
            return Ok(categories);


        }

        [Route("GetCategoryByname/{name}")]
        [HttpGet]
        public IActionResult GetCategoryById(string name)
        {
            
            var category = _db.Categories.Where(c => c.CategoryName == name).FirstOrDefault();
            return Ok(category);
        }

        [Route("GetCategoryById/{id}")]
        [HttpGet]
        public IActionResult GetCategoryById(int id)
        {
            if (id <= 0)
                return BadRequest();
            var category = _db.Categories.Where(c => c.Id == id).FirstOrDefault();
            return Ok(category);
        }

        [HttpPost("AddCategories")]
        public IActionResult AddCategories([FromForm] CategoriesRequestDTO category)

        {
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }
            var imageFile = Path.Combine(ImagesFolder, category.Image.FileName);
            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                category.Image.CopyToAsync(stream);
            }

            var c = new Category
            {
                CategoryName = category.CategoryName,
                Description = category.Description,
                Image = category.Image.FileName,
            };

            _db.Categories.Add(c);
            _db.SaveChanges();
            return Ok(c);
        }


        [HttpPut("UpdateCategory/{id}")]
        public IActionResult UpdateCategory(int id, [FromForm] CategoriesRequestDTO category)
        {
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            var imageFile = Path.Combine(ImagesFolder, category.Image.FileName);
            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                category.Image.CopyToAsync(stream);
            }
            var c = _db.Categories.FirstOrDefault(l => l.Id == id);
            c.CategoryName = category.CategoryName;
            c.Description = category.Description;
            c.Image = category.Image.FileName;
            //c.CategoryImage = category.CategoryImage.FileName ?? c.CategoryImage;

            _db.Categories.Update(c);
            _db.SaveChanges();
            return Ok(c);

        }



        [HttpDelete("DeleteCategory/{id}")]
        public IActionResult Delete(int id)
        {
            // Validate the category ID
            if (id <= 0)
                return BadRequest();

            // Remove reviews for products in the category
            var deletedReviews = _db.Reviews
                .Join(_db.Products,
                    review => review.ProductId,
                    product => product.Id,
                    (review, product) => new { review, product })
                .Where(rp => rp.product.CategoryId == id)
                .Select(rp => rp.review)
                .ToList();
            _db.Reviews.RemoveRange(deletedReviews);

            // Remove products in carts that belong to the category
            var deletedCartProducts = _db.Carts
                .Join(_db.Products,
                    cart => cart.ProductId,
                    product => product.Id,
                    (cart, product) => new { cart, product })
                .Where(cp => cp.product.CategoryId == id)
                .Select(cp => cp.cart)
                .ToList();
            _db.Carts.RemoveRange(deletedCartProducts);

            // Remove products in orders that belong to the category
            var deletedOrderProducts = _db.Orders
                .Join(_db.Products,
                    order => order.ProductId, // Adjust if the relationship differs
                    product => product.Id,
                    (order, product) => new { order, product })
                .Where(op => op.product.CategoryId == id)
                .Select(op => op.order)
                .ToList();
            _db.Orders.RemoveRange(deletedOrderProducts);

            // Remove products in the category
            var deletedProducts = _db.Products.Where(p => p.CategoryId == id).ToList();
            _db.Products.RemoveRange(deletedProducts);

            // Save changes to the database
            _db.SaveChanges();

            // Remove the category itself
            var deleteCategory = _db.Categories.FirstOrDefault(x => x.Id == id);
            if (deleteCategory != null)
            {
                _db.Categories.Remove(deleteCategory);
                _db.SaveChanges();
            }

          
            return NoContent();
        }


    }
}
