using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.DTO.Order;

public class CreateOrderDTO
{
    public List<OrderItemDTO> OrderItems { get; set; }
    public string? UserKeycloackId { get; set; } = null;
    public DateTime Date { get; set; }
}