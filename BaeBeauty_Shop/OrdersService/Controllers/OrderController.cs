using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OrdersService.Model;
using OrdersService.Repository;
using System.Net.Http;
using System.Security.Claims;

namespace OrdersService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly ApiClientHelper _apiClientHelper;
        private readonly OrderDBContext _context;
        private readonly OrderRepository _orderRepo;
        private readonly IEmailService _emailService;

        public OrderController(ApiClientHelper apiClientHelper, OrderDBContext context, OrderRepository orderRepo, IEmailService emailService)
        {
            _apiClientHelper = apiClientHelper;
            _context = context;
            _orderRepo = orderRepo;
            _emailService = emailService;
        }
        // Tạo đơn hàng
        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Thiếu token xác thực.");
            }

            // Kiểm tra xem đã có đơn hàng "Pending" chưa
            var existingPendingOrder = await _context.Orders
                .Include(o => o.OrdersItems)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

            if (existingPendingOrder != null)
            {
                return Ok(new
                {
                    message = "⚠️ Bạn đã có đơn hàng đang chờ thanh toán!",
                    orderId = existingPendingOrder.OrderId,
                    discountCode = existingPendingOrder.DiscountCode,
                    totalProductCost = existingPendingOrder.OrdersItems.Sum(i => i.Price * i.SoLuong),
                    discount = existingPendingOrder.Discount,
                    ship = existingPendingOrder.Ship,
                    totalCost = existingPendingOrder.TotalCost
                });
            }
            var status = request.PaymentMethod == "COD" ? "Chờ xác nhận" : "Pending";
            // Tạo mới đơn hàng nếu chưa có đơn "Pending"
            var newOrder = new Order
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                Status = status,
                TotalCost = 0m,
                Discount = request.Discount,
                Ship = request.Ship,
                DiscountCode = request.DiscountCode,
                OrdersItems = new List<OrdersItem>()
            };

            string productServiceUrl = "https://localhost:7007/api/Product/";
            decimal totalProductCost = 0m;

            foreach (var item in request.Items)
            {
                var productResponse = await _apiClientHelper.GetAsync($"{productServiceUrl}{item.ProductId}", token);
                if (string.IsNullOrEmpty(productResponse))
                    return BadRequest($"Không tìm thấy sản phẩm với ID: {item.ProductId}");

                var product = JsonConvert.DeserializeObject<ProductDto>(productResponse);
                if (product == null)
                    return BadRequest($"Dữ liệu sản phẩm không hợp lệ với ID: {item.ProductId}");

                decimal itemTotal = product.Price * item.Quantity;
                totalProductCost += itemTotal;

                var orderItem = new OrdersItem
                {
                    NameReceive = request.NameReceive,
                    Phone = request.Phone,
                    Email = request.Email,
                    Address = request.Address,
                    ProductId = product.ProductId,
                    CategoryName = product.CategoryName,
                    Name = product.Name,
                    ImageProduct = product.Image,
                    SoLuong = item.Quantity,
                    Price = product.Price,
                    Discount = 0,
                    Ship = 0,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = "Chưa thanh toán",
                    TotalCost = itemTotal,
                    Note = request.Note,
                    CreatedDate = DateTime.Now
                };

                newOrder.OrdersItems.Add(orderItem);
            }

            decimal discount = request.Discount;
            decimal ship = request.Ship;
            newOrder.TotalCost = totalProductCost - discount + ship;
            newOrder.TotalCost = newOrder.TotalCost < 0 ? 0 : newOrder.TotalCost;

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();
            // Tiến hành xóa giỏ hàng 
            if (newOrder.Status == "Chờ xác nhận" || newOrder.Status == "Completed")
            {
                string cartServiceUrl = "https://localhost:7099/api/Cart/delete-cart";
                await _apiClientHelper.DeleteAsync(cartServiceUrl, token);
            }

            return Ok(new
            {
                message = "✅ Đơn hàng đã tạo thành công!",
                orderId = newOrder.OrderId,
                discountCode = newOrder.DiscountCode,
                totalProductCost,
                discount = newOrder.Discount,
                ship = newOrder.Ship,
                totalCost = newOrder.TotalCost
            });
        }
        // Cập nhật trạng thái đơn hàng
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("sync-order-payment-status")]
        public async Task<IActionResult> SyncOrderPaymentStatus()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("Không tìm thấy thông tin người dùng.");

                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var response = await _apiClientHelper.GetAsync("https://localhost:7100/api/Payment/check-payment-by-user", token);

                if (response.StartsWith("Lỗi API: Unauthorized"))
                    return Unauthorized("Token không hợp lệ hoặc hết hạn.");

                if (response.StartsWith("Lỗi"))
                    return StatusCode(500, response);

                var paymentInfo = JsonConvert.DeserializeObject<PaymentResponse>(response);

                if (paymentInfo == null)
                    return BadRequest("Không lấy được thông tin thanh toán.");

                if (paymentInfo.status == "Completed")
                {
                    var order = _orderRepo.GetById(paymentInfo.orderId);
                    if (order == null)
                        return NotFound("Không tìm thấy đơn hàng tương ứng.");

                    order.Status = "Completed";
                    _orderRepo.Update(order);

                    // Gửi email khi trạng thái đơn hàng là Completed
                    if (order.Status == "Completed")
                    {
                        string subject = "Xác nhận đơn hàng thành công";
                        string body = $"<h3>Chào bạn,</h3><p>Đơn hàng #{order.OrderId} của bạn đã được thanh toán thành công!</p>";

                        // Lấy email trong OrdersItems (ví dụ lấy email của item đầu tiên)
                        var firstEmail = order.OrdersItems.FirstOrDefault()?.Email;
                        if (!string.IsNullOrEmpty(firstEmail))
                        {
                            await _emailService.SendEmailAsync(firstEmail, subject, body);
                        }
                    }

                    return Ok("Đã cập nhật trạng thái đơn hàng.");
                }

                return Ok("Giao dịch chưa hoàn tất, không cập nhật trạng thái đơn hàng.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return StatusCode(500, "Đã xảy ra lỗi khi đồng bộ trạng thái đơn hàng.");
            }
        }
        // Test Mail
        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail()
        {
            await _emailService.SendEmailAsync("thanhh8803@gmail.com", "Test Email", "Nội dung test thử");
            return Ok("Email đã được gửi!");
        }
        // Kiểm tra đơn hàng Pending
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("pending-order")]
        public async Task<IActionResult> GetPendingOrder()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            var pendingOrder = await _context.Orders
                .Include(o => o.OrdersItems)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

            if (pendingOrder == null)
                return Ok(new { hasPending = false });

            return Ok(new
            {
                hasPending = true,
                orderId = pendingOrder.OrderId,
                totalCost = pendingOrder.TotalCost,
                createdDate = pendingOrder.CreatedDate
            });
        }

        // Cập nhật trạng thái sau khi Hủy đơn hàng
        [Authorize(Policy = "UserOrAdmin")]
        [HttpPatch("update-status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateStatusRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            var order = _orderRepo.GetById(orderId);

            if (order == null)
                return NotFound("Đơn hàng không tồn tại");

            var allowedStatuses = new[] { "Pending", "Completed", "Cancelled" };
            if (!allowedStatuses.Contains(request.Status))
                return BadRequest("Trạng thái không hợp lệ");

            order.Status = request.Status;
            _orderRepo.Update(order);

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }
        // Lấy tất cả đơn hàng theo UserId
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("get-orders")]
        public async Task<IActionResult> GetOrdersByUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            try
            {
                var orders = _context.Orders
                    .Where(o => o.UserId == userId)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.CreatedDate,
                        o.Status,
                        o.TotalCost,
                        o.Discount,
                        o.Ship,
                        Items = o.OrdersItems.Select(i => new
                        {
                            i.ProductId,
                            i.Name,
                            i.ImageProduct,
                            i.SoLuong,
                            i.Price,
                            i.TotalCost,
                            i.CategoryName,
                            i.CreatedDate,
                            i.PaymentStatus
                        }).ToList()
                    })
                    .OrderByDescending(o => o.CreatedDate)
                    .ToList();

                if (!orders.Any())
                    return NotFound("Không có đơn hàng nào.");

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
        // Lấy tất cả đơn hàng 
        [Authorize(Policy = "AdminOnly")] 
        [HttpGet("all-order")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var orders = _context.Orders
                    .OrderByDescending(o => o.CreatedDate)
                    .ToList();

                var result = new List<object>();

                foreach (var order in orders)
                {
                    string userServiceUrl = $"https://localhost:7200/api/User/{order.UserId}";
                    string userResponse = await _apiClientHelper.GetAsync(userServiceUrl, token);

                    string username = "Không xác định";

                    if (!string.IsNullOrEmpty(userResponse))
                    {
                        try
                        {
                            dynamic userObj = JsonConvert.DeserializeObject(userResponse);
                            username = userObj?.username ?? "Không xác định";
                        }
                        catch
                        {
                            // Bạn có thể log lỗi ở đây nếu cần
                        }
                    }

                    result.Add(new
                    {
                        order.OrderId,
                        order.UserId,
                        Username = username,
                        order.CreatedDate,
                        order.Status,
                        order.TotalCost,
                        order.Discount,
                        order.Ship
                    });
                }

                if (!result.Any())
                    return NotFound("Không có đơn hàng nào.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
        // Lấy chi tiết đơn hàng
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("detail/{orderId}")]
        public async Task<IActionResult> GetOrderDetail(int orderId)
        {
            try
            {
                var order = _context.Orders
                    .Where(o => o.OrderId == orderId)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.UserId,
                        o.CreatedDate,
                        o.Status,
                        o.TotalCost,
                        o.Discount,
                        o.Ship,
                        o.DiscountCode,
                        Items = o.OrdersItems.Select(i => new
                        {
                            i.OrderItemId,
                            i.OrderId,
                            i.Phone,
                            i.Email,
                            i.Address,
                            i.ProductId,
                            i.SoLuong,
                            i.Price,
                            i.Discount,
                            i.Ship,
                            i.CreatedDate,
                            i.PaymentMethod,
                            i.PaymentStatus,
                            i.TotalCost,
                            i.Note,
                            i.NameReceive,
                            i.Name,
                            i.ImageProduct,
                            i.CategoryName
                        }).ToList()
                    })
                    .FirstOrDefault();

                if (order == null)
                    return NotFound("Không tìm thấy đơn hàng.");

                // Lấy username từ UserService
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                string userApiUrl = $"https://localhost:7200/api/User/{order.UserId}";
                string userResponse = await _apiClientHelper.GetAsync(userApiUrl, token);

                string username = "Không xác định";
                if (!string.IsNullOrEmpty(userResponse))
                {
                    try
                    {
                        var userObj = JsonConvert.DeserializeObject<dynamic>(userResponse);
                        username = userObj?.username ?? "Không xác định";
                    }
                    catch { }
                }

                return Ok(new
                {
                    order.OrderId,
                    order.UserId,
                    Username = username,
                    order.CreatedDate,
                    order.Status,
                    order.TotalCost,
                    order.Discount,
                    order.DiscountCode,
                    order.Ship,
                    order.Items
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        
        // Xóa đơn hàng theo OrderId (chỉ Admin được phép)
        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("delete/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            try
            {
                // Tìm đơn hàng theo ID
                var order = await _context.Orders.FindAsync(orderId);

                if (order == null)
                    return NotFound("Không tìm thấy đơn hàng.");

                // Xóa chi tiết đơn hàng trước (nếu dùng quan hệ 1-n)
                var items = _context.OrdersItems.Where(i => i.OrderId == orderId).ToList();
                _context.OrdersItems.RemoveRange(items);

                // Xóa đơn hàng
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok($"Đã xóa đơn hàng #{orderId} thành công.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xóa đơn hàng: {ex.Message}");
            }
        }

        // Thực hiện sửa thông tin đơn hàng
        [Authorize(Policy = "AdminOnly")]
        [HttpPut("update-order-info/{orderId}")]
        public async Task<IActionResult> UpdateOrderInfo(int orderId, [FromBody] UpdateOrderInfoRequest request)
        {
            var order = _context.Orders
                .Include(o => o.OrdersItems) // ✅ cần thiết để cập nhật
                .Where(o => o.OrderId == orderId)
                .FirstOrDefault();

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            // Cập nhật các thông tin cho từng OrderItem
            foreach (var item in order.OrdersItems)
            {
                item.Address = request.Address;
                item.Phone = request.Phone;
                item.Email = request.Email;
                item.Note = request.Note;
            }

            // Cập nhật trạng thái đơn hàng
            order.Status = request.Status;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin đơn hàng thành công!" });
        }
    }
}
