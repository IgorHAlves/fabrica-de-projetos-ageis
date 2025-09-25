using ECOMMERCE.CORE.DTO.User;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IUserService
{
    public GetUserDTO VerifyUser(string keycloakId);
}