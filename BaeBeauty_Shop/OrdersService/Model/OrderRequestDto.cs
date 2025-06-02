namespace OrdersService.Model
{
    public class OrderItemRequest
    {
        public int ProductId { get; set; } // <- thêm dòng này
        public int Quantity { get; set; }   // <- thêm dòng này
    }

    public class CreateOrderRequest
    {
        public int OrderId { get; set; }      // Nếu bạn cho phép truyền ID từ client

        public string? NameReceive { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public decimal Discount { get; set; }
        public string DiscountCode { get; set; }
        public decimal Ship { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string Note { get; set; }

        public List<OrderItemRequest> Items { get; set; }
    }
}