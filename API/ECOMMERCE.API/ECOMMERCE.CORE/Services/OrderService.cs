using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
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

    public Guid CreateOrder(CreateOrderDTO orderDto)
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
           
           return newOrder.Id;

        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao criar pedido: "+ ex.Message);
        }
    }

    public List<GetOrderDTO> GetOrders(int pageNumber, int pageSize)
    {
        try
        {
            Paginator<Order> orders = _orderRepository.GetOrders(pageNumber, pageSize);
            
            List<GetOrderDTO> orderListDTO = new List<GetOrderDTO>();
            foreach (Order order in orders.Items)
            {
                List<OrderProductDTO> orderProductListDTO = new List<OrderProductDTO>();

                foreach (OrderItem orderItem in order.OrderItems)
                {
                    OrderProductDTO orderProductDTO = new OrderProductDTO()
                    {
                        Id = orderItem.ProductId,
                        ProductName = orderItem.Product.Name,
                        ProductPrice = orderItem.Product.Price,
                        ImageUrl = orderItem.Product.ImageUrl,  
                    };
                    orderProductListDTO.Add(orderProductDTO);
                }
                
                GetOrderDTO orderDTO = new GetOrderDTO()
                {
                    PageSize = pageSize,
                    Id = order.Id,
                    Products = orderProductListDTO,
                    OrderPrice = order.Price
                };
                orderListDTO.Add(orderDTO);
            }
            return orderListDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public GetOrderDTO GetOrder(Guid orderId)
    {
        Order order = _orderRepository.GetOrder(orderId);
        
        List<OrderProductDTO> orderProductsDTO = new List<OrderProductDTO>();
        
        OrderProductDTO orderProductDTO = new OrderProductDTO();
        
        GetOrderDTO orderDTO = new GetOrderDTO();
        foreach (OrderItem orderItem in order.OrderItems)
        {
            orderProductDTO = new OrderProductDTO()
            {
                Id = orderItem.ProductId,
                ProductName = orderItem.Product.Name,
                ProductPrice = orderItem.Product.Price,
                ImageUrl = orderItem.Product.ImageUrl
            };

            orderDTO = new GetOrderDTO()
            {
                Id = order.Id,
                Products = orderProductsDTO,
                OrderPrice = orderItem.Price
            };
            
            orderProductsDTO.Add(orderProductDTO);
        }
        return orderDTO;
    }
}