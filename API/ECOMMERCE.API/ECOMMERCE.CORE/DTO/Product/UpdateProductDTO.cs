namespace ECOMMERCE.CORE.DTO.Product;

public class UpdateProductDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageURL { get; set; }
    public int Stock { get; set; }
    public Guid CategoryId { get; set; }
    public Guid? IdPai { get; set; }
}