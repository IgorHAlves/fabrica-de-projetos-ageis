using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IOrderService
{
    public Guid CreateOrder(CreateOrderDTO orderDto);
    public List<GetOrderDTO> GetOrders(int pageNumber, int pageSize);
    public GetOrderDTO GetOrder(Guid id);
    
}