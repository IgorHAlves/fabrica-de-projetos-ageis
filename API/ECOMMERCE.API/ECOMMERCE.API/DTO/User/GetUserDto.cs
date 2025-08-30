using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.DTO.User;

public class GetUserDto
{
    public string Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public Address Address { get; set; }
    public string Phone { get; set; }
}