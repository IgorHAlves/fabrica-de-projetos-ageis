using System.Security.Cryptography.X509Certificates;
using ECOMMERCE.API.Data;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;

namespace ECOMMERCE.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly Context _context;

    public UserRepository(Context context)
    {
        _context = context;
    }
    public User GetUserByKeycloakId(string keycloakId)
    {
        User user = _context.Users.FirstOrDefault(user => user.KeycloakId == keycloakId);
        
        return user;
    }

    public User CreateUser(string keycloakId)
    {
        User user = new User();
        user.KeycloakId = keycloakId;

        _context.Users.Add(user);
        
        _context.SaveChanges();
        
        return user;
    }
}