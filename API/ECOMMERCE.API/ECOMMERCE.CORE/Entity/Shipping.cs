namespace ECOMMERCE.CORE.Entity;

public class Shipping : BaseEntity
{
    public decimal? Price { get; set; }
    public string CEP { get; set; }
}