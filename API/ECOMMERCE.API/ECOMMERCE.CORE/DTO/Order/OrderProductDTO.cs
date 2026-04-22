using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.DTO.Order;

public class OrderProductDTO
{

    public static OrderProductDTO AutoMapOrderProductDto(OrderItem orderItem)
    {
        OrderProductDTO orderProductDTO = new OrderProductDTO()
        {
            Id = orderItem.ProductId,
            ProductName = orderItem.Product.Name,
            ProductPrice = orderItem.Product.Price,
            ImageUrl = orderItem.Product.ImageUrl,  
        };
        return orderProductDTO;
    }
    public Guid? Id { get; set; }
    public string ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    public string ImageUrl { get; set; }
}