using System.ComponentModel.DataAnnotations;

namespace ECOMMERCE.CORE.Entity;

public class Shipping : BaseEntity
{
    public decimal? Price { get; set; }
    public string? Cep { get; set; }
}