using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.API.Entity;

public class Order : BaseEntity
{
    public DateTime Date { get; set; }
    public decimal Price { get; set; }
    public List<OrderItem> OrderItems { get; set; }
    public User User { get; set; }
    public Guid UserId { get; set; }
}