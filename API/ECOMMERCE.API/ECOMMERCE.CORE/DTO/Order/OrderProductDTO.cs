namespace ECOMMERCE.CORE.DTO.Order;

public class OrderProductDTO
{
    public Guid? Id { get; set; }
    public string ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    public string ImageUrl { get; set; }
}