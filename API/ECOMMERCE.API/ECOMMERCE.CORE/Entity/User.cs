using ECOMMERCE.API.Entity;

namespace ECOMMERCE.CORE.Entity
{
    public class User : BaseEntity
    {
        public string KeycloakId { get; set; }
        public Guid? AddressId { get; set; }
        public Address? Address { get; set; }
        public ICollection<Order> Orders { get; set; }
        public User()
        {
    
        }
    }
}