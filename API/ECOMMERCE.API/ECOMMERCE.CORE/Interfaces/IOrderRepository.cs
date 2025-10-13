using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces;

public interface IOrderRepository
{
    public Order CreateOrder(Order order);
    public Paginator<Order> GetOrders(int pageNumber, int pageSize);
    public Order GetOrder(Guid id);
}