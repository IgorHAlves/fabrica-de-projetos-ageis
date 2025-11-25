using System.Reflection.Emit;
using ECOMMERCE.CORE.DTO.User;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IUserService
{
    public GetUserDTO VerifyUser(string keycloakId);
    public Guid CreateAddress(string keycloakId, CreateAddressDTO address);
}