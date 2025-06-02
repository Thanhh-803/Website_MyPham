namespace OrdersService.Model
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public string Image { get; set; } // ✅ Thêm trường ProductImage
        public decimal Price { get; set; }
    }
}
