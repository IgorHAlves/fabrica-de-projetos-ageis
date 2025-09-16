namespace ECOMMERCE.API.Entity;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } 
    public string Description { get; set; } 
    public Decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public Guid? IdPai { get; set; }

   
}