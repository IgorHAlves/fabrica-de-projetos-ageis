using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IUserService
{
    public User VerifyUser(string keycloakId);
}