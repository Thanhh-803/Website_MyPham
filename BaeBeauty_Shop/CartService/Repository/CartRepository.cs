using CartService.Model;
using Microsoft.EntityFrameworkCore;

namespace CartService.Repository
{
    public class CartRepository: GenericRepository<Cart>
    {

        private readonly CartDBContext _context;

        public CartRepository()
        {
            _context = new CartDBContext();
        }
        public Cart GetByUserId(int userId)
        {
            return _context.Carts.FirstOrDefault(c => c.UserId == userId);
        }

        
    }
}
