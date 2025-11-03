namespace ECOMMERCE.CORE.Entity;

public class Product : BaseEntity
{
    public string Name { get; set; } 
    public string Description { get; set; } 
    public Decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Stock { get; set; }
    public Guid? IdPai { get; set; }
    
    public Category Category { get; set; }
    
    public Guid CategoryId { get; set; }
    
}