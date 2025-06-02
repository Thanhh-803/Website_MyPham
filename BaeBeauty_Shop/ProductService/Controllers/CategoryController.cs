using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Model;
using ProductService.Repository;
using System.Transactions;

namespace ProductService.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {

        private readonly CategoryRepository _categorytRepo;
        private readonly ProductDBContext _context;

        public CategoryController()
        {
            _categorytRepo= new CategoryRepository();
            _context= new ProductDBContext();
        }
        [HttpGet]
        public IActionResult Get()
        {
            var catories = _categorytRepo.GetAll();
            return new OkObjectResult(catories);
        }
        // Lấy tất cả sản phẩm theo ID
        [HttpGet("category/{id}")]
        public async Task<IActionResult> GetCategoryWithProducts(int id)
        {
            var category = await _context.Categories
                .Where(c => c.CategoryId == id)
                .Select(c => new
                {
                    categoryId = c.CategoryId,
                    name = c.Name,
                    decription = c.Decription,
                    products = c.Products.Select(p => new
                    {
                        productId = p.ProductId,
                        name = p.Name,
                        price = p.Price,
                        image = p.Image
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Category category)
        {
            using (var scope = new TransactionScope())
            {
                _categorytRepo.Insert(category);
                scope.Complete();
                return CreatedAtAction(nameof(Get), new { id = category.CategoryId }, category);
            }
        }
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Category category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest("ID không hợp lệ");
            }
            using (var scope = new TransactionScope())
            {
                _categorytRepo.Update(category);
                scope.Complete();
                return Ok("Cập nhật thành công");
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _categorytRepo.Delete(id);
            return new OkResult();
        }
    }
}
