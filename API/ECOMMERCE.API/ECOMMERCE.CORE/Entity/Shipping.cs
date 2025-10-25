namespace ECOMMERCE.CORE.Entity;

public class Shipping
{
    public Guid Id { get; set; }
    public decimal? Price { get; set; }
    public string CEP { get; set; }
}