using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.DTO.User
{
    public class CreateUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public CreateAddressDTO Address{ get; set; }
        public string Phone { get; set; }
    }
}
