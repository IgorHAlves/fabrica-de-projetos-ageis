using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public Order CreateOrder(CreateOrderDTO orderDto)
    {
        try
        {            
            var user = _userRepository.GetUserByKeycloakId(orderDto.UserKeycloackId);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            
            Product product;
           List<Product>? products = null;
           foreach (var item in orderDto.OrderItems)
           {
               product = _productRepository.GetProduct(item.ProductId);
               if (product == null)
               {
                   throw new Exception("Product not found");
               }
               products.Add(product);
           }

           List<OrderItem>? orderItems = null;

           OrderItem orderItem;
           foreach (var item in products)
           {
               orderItem = new OrderItem
               {
                   Product = item,
                   ProductId = item.Id,
                   Price = item.Price,
                   Quantity = orderDto.OrderItems.Where(o => o.ProductId == item.Id).Select(o => o.Quantity)
                       .FirstOrDefault()
               };
           }

           Order order = new Order()
           {
               UserId = user.Id,
               Date = DateTime.Now,
               User = user,
               OrderItems = orderItems,
               Price = products.Sum(p => p.Price)
           };

           Order newOrder = _orderRepository.CreateOrder(order);
           
           return newOrder;

        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao criar pedido: "+ ex.Message);
        }
    }

    public List<Order> GetOrders()
    {
        List<Order> orders = _orderRepository.GetOrders();
        return orders;
    }

    public Order GetOrder(Guid id)
    {
        var order = _orderRepository.GetOrder(id);
        return order;
    }
}