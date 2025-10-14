using ECOMMERCE.CORE.DTO.Product;

namespace ECOMMERCE.CORE.DTO.Category;

public class GetCategoriesDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<GetProductDTO> Products { get; set; }
}