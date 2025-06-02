using Microsoft.AspNetCore.Mvc;
using System.Transactions;
using UserService.Model;
using UserService.Repository;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepo;


        public UserController()
        {
            _userRepo = new UserRepository();
        }
        [HttpGet("all")]
        public IActionResult Get()
        {
            var products = _userRepo.GetAll();
            return new OkObjectResult(products);
        }
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var product = _userRepo.GetById(id);
            return new OkObjectResult(product);
        }
        [HttpPost("Create")]
        public IActionResult Post([FromBody] User user)
        {
            using (var scope = new TransactionScope())
            {
                _userRepo.Insert(user); 
                scope.Complete();
                return CreatedAtAction(nameof(Get), new { id = user.UserId }, user);
            }
        }
        [HttpPut("Edit/{id}")]
        public IActionResult Put(int id, [FromBody] User user)
        {
            if (id != user.UserId)
            {
                return BadRequest("ID không hợp lệ");
            }
            using (var scope = new TransactionScope())
            {
                _userRepo.Update(user);
                scope.Complete();
                return Ok("Cập nhật thành công");
            }
        }
        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            _userRepo.Delete(id);
            return new OkResult();
        }
    }
}
