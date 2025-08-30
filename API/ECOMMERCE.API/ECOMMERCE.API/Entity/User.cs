using System.ComponentModel.DataAnnotations;

namespace ECOMMERCE.API.Entity
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public Address Address { get; set; }
        public string Phone { get; set; }
        public bool Adm { get; set; } = false;

        public User()
        {
            
        }
    }
}
