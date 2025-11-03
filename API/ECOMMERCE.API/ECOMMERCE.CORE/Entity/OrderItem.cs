using ECOMMERCE.API.Entity;

namespace ECOMMERCE.CORE.Entity;

public class OrderItem : BaseEntity
{
    public Product Product { get; set; }
    public Guid ProductId { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}