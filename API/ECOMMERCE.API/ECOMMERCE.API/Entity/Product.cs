using Microsoft.AspNetCore.Authentication;

namespace ECOMMERCE.API.Entity;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public List<Variant> Variants { get; set; } = new();

    public Product()
    {
        
    }
}