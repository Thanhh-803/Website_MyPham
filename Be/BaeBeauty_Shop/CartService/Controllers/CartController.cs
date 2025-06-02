using CartService.Model;
using CartService.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace CartService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : Controller
    {
        private readonly CartRepository _cartRepo;
        private readonly CartItemRepository _cartItemRepo;
        private readonly ApiClientHelper _apiClientHelper;
        private readonly CartDBContext _context;

        public CartController()
        {
            _cartRepo = new CartRepository();
            _cartItemRepo = new CartItemRepository();
            _apiClientHelper = new ApiClientHelper();
            _context = new CartDBContext();
        }

        // Thêm sản phẩm vào giỏ hàng
        [Authorize(Policy = "UserOnly")]
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromBody] AddCartItemsRequest request)
        {
            // Lấy thông tin người dùng từ claim (userId, username, role)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value); // Lấy userId từ claim
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            if (roleClaim == null || roleClaim.Value != "User")
            {
                return Unauthorized("Chỉ người dùng với quyền User mới có thể thực hiện hành động này.");
            }

            string productServiceUrl = "https://localhost:7007/api/";

            // Kiểm tra xem request có chứa sản phẩm hay không
            if (request.Items == null || !request.Items.Any())
                return BadRequest("Danh sách sản phẩm không được để trống.");

            // Tìm hoặc tạo giỏ hàng cho người dùng
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                // Nếu giỏ hàng không tồn tại, tạo mới
                cart = new Cart
                {
                    UserId = userId,
                    CreateDate = DateTime.Now,
                    TotalCartPrice = 0,
                    OriginalTotal = 0,
                    Quantity = 0,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            decimal originalTotal = 0m;


            // Thêm các sản phẩm vào giỏ hàng
            foreach (var item in request.Items)
            {
                // Gọi API ProductService để lấy thông tin sản phẩm
                var productResponse = await _apiClientHelper.GetAsync(productServiceUrl, $"Product/{item.ProductId}");

                if (!productResponse.IsSuccessStatusCode)
                    return BadRequest($"Không tìm thấy sản phẩm với ID: {item.ProductId}");

                var productJson = await productResponse.Content.ReadAsStringAsync();
                var product = JsonConvert.DeserializeObject<ProductDto>(productJson);

                var existingItem = cart.CartItems.FirstOrDefault(i => i.ProductId == product.ProductId);

                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                if (existingItem != null)
                {
                    existingItem.Quantity += item.Quantity;
                    existingItem.TotalCost = existingItem.Quantity * existingItem.Price;
                }
                else
                {
                    // Nếu sản phẩm chưa có trong giỏ, thêm mới vào giỏ hàng
                    var newItem = new CartItem
                    {
                        CartId = cart.CartId,
                        ProductId = product.ProductId,
                        ProductName = product.Name,
                        ProductImage = product.Image,
                        Quantity = item.Quantity,
                        Price = product.Price,
                        TotalCost = product.Price * item.Quantity
                    };
                    _context.CartItems.Add(newItem);
                }
                // Tính tổng giá gốc
                originalTotal += product.Price * item.Quantity;
            }



            // Cập nhật tổng giá trị của giỏ hàng
            // Sau khi đã thêm hoặc cập nhật toàn bộ CartItems
            cart.Quantity = cart.CartItems.Sum(i => i.Quantity);
            cart.TotalCartPrice = cart.CartItems.Sum(i => i.TotalCost);
            cart.OriginalTotal = cart.CartItems.Sum(i => i.Price * i.Quantity); // Tính lại toàn bộ giỏ hàng
            await _context.SaveChangesAsync();

            // Trả về thông báo thành công
            return Ok(new
            {
                message = "Đã thêm sản phẩm vào giỏ hàng.",
                originalTotal = originalTotal,
                totalCartPrice = cart.TotalCartPrice,
                cartItems = cart.CartItems.Select(i => new
                {
                    cartItemId = i.CartItemId,
                    productId = i.ProductId,
                    productName = i.ProductName,
                    productImage = i.ProductImage,
                    quantity = i.Quantity,
                    price = i.Price,
                    totalCost = i.TotalCost
                }).ToList()
            });
        }

        // Thực hiện giỏ hàng theo Id người dùng
        [Authorize(Policy = "UserOnly")]
        [HttpGet("user-cart")]
        public async Task<IActionResult> GetCartByUserId()
        {
            // Lấy thông tin người dùng từ claim (userId, username, role)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value); // Lấy userId từ claim
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            if (roleClaim == null || roleClaim.Value != "User")
            {
                return Unauthorized("Chỉ người dùng với quyền User mới có thể thực hiện hành động này.");
            }

            var cart = await _context.Carts
                .Where(c => c.UserId == userId)
                .Select(c => new
                {
                    c.TotalCartPrice,
                    c.OriginalTotal,
                    c.Quantity
                })
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound("Không tìm thấy giỏ hàng cho user này.");
            }

            return Ok(cart);
        }
        // Lấy chi tiết thông tin giỏ hàng
        [Authorize(Policy = "UserOnly")]
        [HttpGet("user-cartItem")]
        public async Task<IActionResult> GetCartItem()
        {
            // Lấy userId từ claim trong token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            // Kiểm tra role
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            if (roleClaim == null || roleClaim.Value != "User")
                return Unauthorized("Chỉ người dùng với quyền User mới có thể thực hiện hành động này.");

            // Truy vấn giỏ hàng và danh sách sản phẩm trong giỏ
            var cart = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.CartItems) // lấy luôn cartItems
                .Select(c => new
                {
                    c.CartId,
                    c.TotalCartPrice,
                    c.OriginalTotal,
                    c.Quantity,
                    c.Discount,
                    c.DiscountCode,
                    Items = c.CartItems.Select(ci => new
                    {
                        ci.CartItemId,
                        ci.ProductId,
                        ci.ProductName,
                        ci.ProductImage,
                        ci.Price,
                        ci.Quantity,
                        ci.TotalCost
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (cart == null)
                return NotFound("Không tìm thấy giỏ hàng cho user này.");

            return Ok(cart);
        }
        // Cập nhật số lượng sản phẩm 
        [Authorize(Policy = "UserOnly")]
        [HttpPut("update-item-quantity/{cartItemId}")]
        public async Task<IActionResult> UpdateItemQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            if (roleClaim == null || roleClaim.Value != "User")
            {
                return Unauthorized("Chỉ người dùng với quyền User mới có thể thực hiện hành động này.");
            }

            string productServiceUrl = "https://localhost:7007/api/";

            var cartItem = _cartItemRepo.GetById(cartItemId);
            if (cartItem == null)
            {
                return NotFound("Sản phẩm trong giỏ hàng không tồn tại.");
            }

            if (cartItem.Cart == null)
            {
                return Unauthorized("Không tìm thấy giỏ hàng.");
            }
            if (cartItem.Cart.UserId != userId)
            {
                return Unauthorized("Không tìm thấy UserID.");
            }

            if (request.Quantity <= 0)
            {
                return BadRequest("Số lượng phải lớn hơn 0.");
            }

            var response = await _apiClientHelper.GetAsync(productServiceUrl, $"Product/{cartItem.ProductId}");
            if (!response.IsSuccessStatusCode)
            {
                return NotFound($"Sản phẩm với ID {cartItem.ProductId} không tồn tại.");
            }

            var productJson = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(productJson))
            {
                return NotFound("Không có dữ liệu sản phẩm từ Product Service.");
            }

            var productObj = JsonConvert.DeserializeObject<ProductDto>(productJson);

            // Cập nhật CartItem
            cartItem.Quantity = request.Quantity;
            cartItem.TotalCost = productObj.Price * request.Quantity;
            _cartItemRepo.Update(cartItem);

            // Lấy lại thông tin cart và các item
            var cart = cartItem.Cart;
            var cartItems = _cartItemRepo.GetByCartId(cart.CartId);

            // Tính lại tổng tiền và tổng số lượng
            decimal originalTotal = 0;
            decimal discountAmount = 0;
            int totalQuantity = 0;

            foreach (var item in cartItems)
            {
                var productResp = await _apiClientHelper.GetAsync(productServiceUrl, $"Product/{item.ProductId}");
                if (!productResp.IsSuccessStatusCode) continue;

                var productData = await productResp.Content.ReadAsStringAsync();
                var productInfo = JsonConvert.DeserializeObject<ProductDto>(productData);

                originalTotal += productInfo.Price * item.Quantity;
                totalQuantity += item.Quantity;
            }

            // Tính giảm giá nếu có
            if (cart.Discount.HasValue)
            {
                discountAmount = cart.Discount.Value;
            }

            cart.OriginalTotal = originalTotal;
            cart.TotalCartPrice = Math.Max(originalTotal - discountAmount, 0); // tránh âm tiền
            cart.Quantity = totalQuantity;

            _cartRepo.Update(cart);

            var refreshedCartItem = _cartItemRepo.GetById(cartItemId);

            return Ok(new
            {
                Message = "Cập nhật số lượng sản phẩm thành công.",
                CartItem = new
                {
                    refreshedCartItem.ProductId,
                    refreshedCartItem.Quantity,
                    refreshedCartItem.TotalCost
                },
                CartSummary = new
                {
                    TotalItemQuantity = cart.Quantity,
                    OriginalTotal = cart.OriginalTotal,
                    DiscountAmount = discountAmount,
                    TotalCartPrice = cart.TotalCartPrice
                }
            });
        }

        // Thực hiện xóa sản phẩm trong giỏ hàng
        [Authorize(Policy = "UserOnly")]
        [HttpDelete("delete-item/{cartItemId}")]
        public IActionResult DeleteCartItem(int cartItemId)
        {
            // Lấy thông tin người dùng từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { Message = "Không tìm thấy thông tin người dùng." });

            var userId = int.Parse(userIdClaim.Value);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            if (roleClaim?.Value != "User")
            {
                return Unauthorized(new { Message = "Chỉ người dùng với quyền User mới có thể thực hiện hành động này." });
            }

            // Lấy CartItem theo ID
            var cartItem = _cartItemRepo.GetById(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { Message = "Không tìm thấy sản phẩm trong giỏ hàng." });
            }

            // Kiểm tra quyền sở hữu giỏ hàng
            if (cartItem.Cart.UserId != userId)
            {
                return Unauthorized(new { Message = "Sản phẩm này không thuộc giỏ hàng của bạn." });
            }

            // Xóa sản phẩm khỏi giỏ hàng
            _cartItemRepo.Delete(cartItem.CartItemId);

            // Lấy lại thông tin giỏ hàng
            var cart = _cartRepo.GetById(cartItem.CartId);
            if (cart != null)
            {
                // Lấy lại danh sách sản phẩm còn lại trong giỏ
                var allItems = _cartItemRepo.GetByCartId(cart.CartId);

                // Cập nhật tổng số lượng
                cart.Quantity = allItems.Sum(i => i.Quantity);

                // Cập nhật tổng tiền gốc (chưa giảm)
                cart.OriginalTotal = allItems.Sum(i => (i.Price ?? 0) * i.Quantity);

                // Lấy tổng số tiền giảm từ Cart (nếu bạn cập nhật ở nơi khác)
                // Hoặc bạn có thể tính tổng discount từ các item nếu có
                var totalDiscount = cart.Discount ?? 0;

                // Tính tổng tiền sau giảm
                cart.TotalCartPrice = cart.OriginalTotal - totalDiscount;

                // Nếu giỏ hàng trống thì reset
                if (cart.Quantity == 0)
                {
                    cart.TotalCartPrice = 0;
                    cart.OriginalTotal = 0;
                    cart.Discount = 0;
                }

                _cartRepo.Update(cart);
            }

            // Trả kết quả
            return Ok(new
            {
                Message = "Đã xóa sản phẩm khỏi giỏ hàng.",
                CartItemId = cartItemId,
                NewTotalCartPrice = cart?.TotalCartPrice ?? 0,
                NewOriginalTotal = cart?.OriginalTotal ?? 0,
                NewQuantity = cart?.Quantity ?? 0
            });
        }



        // Thực hiện áp mã giảm giá vào giỏ hàng
        [Authorize(Policy = "UserOnly")]
        [HttpPost("apply-discount")]
        public async Task<IActionResult> ApplyDiscountToCart([FromBody] ApplyDiscountDto request)
        {
            // Lấy thông tin người dùng từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            // Lấy giỏ hàng của người dùng
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("Không tìm thấy giỏ hàng.");

            decimal currentTotal = cart.TotalCartPrice ?? 0m;

            // Nếu chưa có OriginalTotal, gán giá trị hiện tại
            if (!cart.OriginalTotal.HasValue || cart.OriginalTotal == 0m)
            {
                cart.OriginalTotal = currentTotal;
            }

            // Kiểm tra xem giỏ hàng đã có mã giảm giá hay chưa
            if (!string.IsNullOrEmpty(cart.DiscountCode))
            {
                return BadRequest("Giỏ hàng đã áp dụng mã giảm giá. Hủy mã trước khi áp dụng mã mới.");
            }

            // Tạo request để gửi đến DiscountService
            var discountRequest = new
            {
                Code = request.DiscountCode,
                OrderTotal = cart.OriginalTotal // Gửi tổng tiền gốc (OriginalTotal) sang DiscountService
            };

            // Gửi POST request để áp dụng mã giảm giá
            string discountServiceUrl = "https://localhost:7070/api/Discount/apply-discount";
            var discountResponse = await _apiClientHelper.PostAsync(discountServiceUrl, "", discountRequest);

            // Kiểm tra phản hồi từ DiscountService
            if (!discountResponse.IsSuccessStatusCode)
            {
                var errorMessage = await discountResponse.Content.ReadAsStringAsync();
                return BadRequest($"Mã giảm giá không hợp lệ hoặc đã hết hạn. Phản hồi từ DiscountService: {errorMessage}");
            }

            // Đọc phản hồi từ DiscountService
            var discountJson = await discountResponse.Content.ReadAsStringAsync();
            var discountResult = JsonConvert.DeserializeObject<DiscountDto>(discountJson);

            // Cập nhật thông tin giỏ hàng
            cart.DiscountCode = discountResult.DiscountCode;
            cart.Discount = discountResult.DiscountAmount;
            cart.TotalCartPrice = cart.OriginalTotal - discountResult.DiscountAmount; // Giá đã giảm

            // Lưu giỏ hàng sau khi cập nhật
            _cartRepo.Update(cart);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Mã giảm giá đã được áp dụng thành công.",
                OriginalTotal = cart.OriginalTotal,
                DiscountAmount = cart.Discount,
                NewTotalCartPrice = cart.TotalCartPrice
            });
        }


        // Thực hiện hủy áp mã giảm giá
        [Authorize(Policy = "UserOnly")]
        [HttpDelete("remove-discount")]
        public async Task<IActionResult> RemoveDiscountFromCart()
        {
            // Lấy thông tin người dùng từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

            var userId = int.Parse(userIdClaim.Value);

            // Lấy giỏ hàng của người dùng
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("Không tìm thấy giỏ hàng.");

            // Kiểm tra nếu đã áp mã giảm giá
            if (!string.IsNullOrEmpty(cart.DiscountCode))
            {
                // Khôi phục giá tiền gốc và reset thông tin giảm giá
                cart.TotalCartPrice = cart.OriginalTotal;
                cart.Discount = 0m;
                cart.DiscountCode = null;

                // Lưu thay đổi vào DB
                _cartRepo.Update(cart);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                Message = "Mã giảm giá đã được huỷ thành công.",
                OriginalTotal = cart.OriginalTotal,
                DiscountAmount = cart.Discount,
                NewTotalCartPrice = cart.TotalCartPrice
            });
        }


        // Xóa giỏ hàng
        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("delete-cart")]
        public async Task<IActionResult> ClearCart()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Không tìm thấy thông tin người dùng.");

            int userId = int.Parse(userIdClaim.Value);

            var userCartItems = _context.Carts.Where(c => c.UserId == userId).ToList();

            if (!userCartItems.Any())
                return NotFound("Giỏ hàng đã trống.");

            _context.Carts.RemoveRange(userCartItems);
            await _context.SaveChangesAsync();

            return Ok("Giỏ hàng đã được xóa.");
        }
    }
}
