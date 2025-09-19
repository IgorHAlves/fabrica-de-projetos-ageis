using ECOMMERCE.API.Data;
using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IUserRepository
{
    public User GetUserByKeycloakId(string keycloakId);
    
    public User CreateUser(string keycloakId);
}