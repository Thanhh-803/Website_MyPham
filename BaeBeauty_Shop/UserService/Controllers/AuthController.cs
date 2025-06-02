using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Model;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserDBContext _context;  

        public AuthController(UserDBContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Kiểm tra người dùng có tồn tại trong database không
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng.");
            }

            // Tạo JWT Token cho người dùng
            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        // Hàm để tạo JWT Token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {

                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // Thêm UserId vào Claims
                new Claim(ClaimTypes.Role, user.TypeUser),
                new Claim(ClaimTypes.Email, user.Email ?? ""),  // Thêm email vào claims
                new Claim("phone", user.Phone ?? "")  // Thêm phone vào claims
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this-is-a-very-strong-secret-key-of-32-characters!"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "https://localhost:7200",
                audience: "BaeBeauty",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        // Lấy Username
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMyInfo()
        {
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var phone = User.Claims.FirstOrDefault(c => c.Type == "phone")?.Value;

            return Ok(new
            {
                Username = username,
                Role = role,
                Email = email,
                Phone = phone
            });
        }
    }
    
}
