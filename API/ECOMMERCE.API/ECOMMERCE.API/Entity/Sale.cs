namespace ECOMMERCE.API.Entity;

public class Sale
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}