using ECOMMERCE.API.Entity;

namespace ECOMMERCE.CORE.Entity
{
    public class User
    {
        public Guid Id { get; set; }
        public string KeycloakId { get; set; }
        public Guid? AddressId { get; set; }
        public Address? Address { get; set; }
        public ICollection<Order> Orders { get; set; }
        public User()
        {
    
        }
    }
}