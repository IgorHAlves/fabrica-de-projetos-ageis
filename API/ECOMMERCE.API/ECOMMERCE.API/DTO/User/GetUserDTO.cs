using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.DTO.User;

public class GetUserDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public GetAddressDTO Address { get; set; }
    public string Phone { get; set; }
}