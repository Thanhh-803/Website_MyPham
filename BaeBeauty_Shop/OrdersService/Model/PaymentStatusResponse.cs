namespace OrdersService.Model
{
    public class PaymentStatusResponse
    {
        public int PaymentId { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
