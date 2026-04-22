using System.Security.Cryptography.X509Certificates;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Data;

namespace ECOMMERCE.DATA.Repositories;

public class UserRepository : IUserRepository
{
    private readonly EcommerceDbContext _ecommerceDbContext;

    public UserRepository(EcommerceDbContext ecommerceDbContext)
    {
        _ecommerceDbContext = ecommerceDbContext;
    }
    public User GetUserByKeycloakId(string keycloakId)
    {
        User user = _ecommerceDbContext.Users.FirstOrDefault(user => user.KeycloakId == keycloakId);
        
        return user;
    }

    public User CreateUser(string keycloakId)
    {
        User user = new User();
        user.KeycloakId = keycloakId;

        _ecommerceDbContext.Users.Add(user);
        
        _ecommerceDbContext.SaveChanges();
        
        return user;
    }

    public Guid CreateAddress(string keycloakId, Address address)
    {
        User user = _ecommerceDbContext.Users.FirstOrDefault(user => user.KeycloakId == keycloakId);
        
        user.Address = address;
        _ecommerceDbContext.Add(address); 
        _ecommerceDbContext.SaveChanges();


        return user.Address.Id;
    }
    
    
}