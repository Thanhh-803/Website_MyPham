using CartService.Model;
using Microsoft.EntityFrameworkCore;

namespace CartService.Repository
{
    public class CartItemRepository: GenericRepository<CartItem>
    {

        private readonly CartDBContext _context;

        public CartItemRepository()
        {
            _context = new CartDBContext();
        }
        

        public CartItem GetByCartIdAndProductId(int cartId, int productId)
        {
            return _context.CartItems.FirstOrDefault(ci => ci.CartId == cartId && ci.ProductId == productId);
        }
        // Phương thức để lấy tất cả CartItem của một CartId
        public List<CartItem> GetByCartId(int cartId)
        {
            return _context.CartItems.Where(c => c.CartId == cartId).ToList();
        }
        public CartItem? GetById(int cartItemId)
        {
            return _context.CartItems
                .Include(ci => ci.Cart) // đảm bảo có lấy Cart
                .FirstOrDefault(ci => ci.CartItemId == cartItemId);
        }
    }
}
