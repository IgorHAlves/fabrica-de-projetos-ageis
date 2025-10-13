namespace ECOMMERCE.CORE.DTO.Order;

public class GetOrderDTO
{
    public Guid? Id { get; set; }
    public List<OrderProductDTO> Products { get; set; }
    public decimal OrderPrice { get; set; }
    public int PageSize { get; set; }
}