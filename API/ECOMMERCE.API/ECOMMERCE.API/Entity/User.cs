namespace ECOMMERCE.API.Entity
{
    public class User
    {
        public Guid Id { get; set; }
        public string KeycloakId { get; set; }
        public Address? Address { get; set; }
        public User()
        {
    
        }
    }
}