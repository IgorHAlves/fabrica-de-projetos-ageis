namespace ECOMMERCE.API.DTO.Product;

public class CreateProductDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public Decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public List<string> IdsVariants { get; set; } = new();
}