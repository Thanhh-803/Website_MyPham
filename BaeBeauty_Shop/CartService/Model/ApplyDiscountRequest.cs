namespace CartService.Model
{
    public class ApplyDiscountRequest
    {
        public string DiscountCode { get; set; }
        public decimal OrderTotal { get; set; }
    }
}
