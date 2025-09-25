using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IUserRepository
{
    public User GetUserByKeycloakId(string keycloakId);
    
    public User CreateUser(string keycloakId);
}