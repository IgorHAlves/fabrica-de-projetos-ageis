using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.API.Interfaces;

public interface IOrderService
{
    public Guid CreateOrder(CreateOrderDTO orderDto);
    public Paginator<GetOrderDTO> GetOrders(int pageNumber, int pageSize);
    public GetOrderDTO GetOrder(Guid id);
    
}