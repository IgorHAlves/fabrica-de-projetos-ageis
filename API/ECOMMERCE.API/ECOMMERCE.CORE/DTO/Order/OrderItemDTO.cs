namespace ECOMMERCE.CORE.DTO.Order;

public class OrderItemDTO
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}