using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;

namespace ECOMMERCE.CORE.Interfaces;

public interface IOrderRepository
{
    public Order CreateOrder(Order order);
    public List<Order> GetOrders();
    public Order GetOrder(Guid id);
}