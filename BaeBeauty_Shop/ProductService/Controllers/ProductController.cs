using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Model;
using ProductService.Repository;
using System.Transactions;

namespace ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private ProcductRepository _productRepo;
        private readonly ProductDBContext _context;

        public ProductController()
        {
            _productRepo = new ProcductRepository();
            _context = new ProductDBContext();
        }
        // Thực hiện lấy tất cả sản phẩm
        [HttpGet]
        public IActionResult Get()
        {
            var products = _context.Products
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.CategoryId,
                    CategoryName = p.Category.Name, 
                    p.Description,
                    p.DescriptionDetails,
                    p.Image,
                    p.Image1,
                    p.Image2,
                    p.Image3,
                    p.Price,
                    p.Inventory,
                    p.ViewCount,
                    p.CreateDate,
                    p.trang_thai
                }).ToList();

            return Ok(products);
        }

        // Thưucj hiện lấy sản phẩm theo ID
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var product = _context.Products
                .Include(p => p.Category)
                .Where(p => p.ProductId == id)
                .Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.CategoryId,
                    CategoryName = p.Category.Name, // Thêm categoryName
                    p.Description,
                    p.DescriptionDetails,
                    p.Image,
                    p.Image1,
                    p.Image2,
                    p.Image3,
                    p.Price,
                    p.Inventory,
                    p.ViewCount,
                    p.CreateDate,
                    p.trang_thai
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
        // Thực hiện tạo mới sản phẩm
        [HttpPost]
        public IActionResult Post([FromBody] Product product)
        {
            using (var scope = new TransactionScope())
            {
                _productRepo.Insert(product);
                scope.Complete();
                return CreatedAtAction(nameof(Get), new { id = product.ProductId }, product);
            }
        }
        // Thực hiện cập nhật sản phẩm
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest("ID không hợp lệ");
            }
            using (var scope = new TransactionScope())
            {
                _productRepo.Update(product);
                scope.Complete();
                return Ok("Cập nhật thành công");
            }
        }
        // Thực hiện xóa sản phẩm
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _productRepo.Delete(id);
            return Ok();
        }

        // Thực hiện lấy sản phẩm nối bật với ViewCount > 100
        [HttpGet ("san-pham-noi-bat")]
        public IActionResult GetProductNoiBat ()
        {
            var popularProducts = _context.Products
            .Where(p => p.ViewCount > 100)
            .ToList();

        return Ok(popularProducts);
        }
    }
}