using ECOMMERCE.CORE.DTO.User;

namespace ECOMMERCE.CORE.DTO.User;

public class GetUserDTO
{
    public Guid Id { get; set; }
    public string keycloakId { get; set; }
    public GetAddressDTO? Address { get; set; }
}