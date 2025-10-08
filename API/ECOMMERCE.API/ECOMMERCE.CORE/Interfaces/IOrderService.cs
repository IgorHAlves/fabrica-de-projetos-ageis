using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IOrderService
{
    public Order CreateOrder(CreateOrderDTO orderDto);
    public List<GetOrderDTO> GetOrders();
    public GetOrderDTO GetOrder(Guid id);
    
}