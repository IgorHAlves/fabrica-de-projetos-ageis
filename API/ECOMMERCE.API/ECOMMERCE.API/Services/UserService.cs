using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;

namespace ECOMMERCE.API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository =  userRepository;
    }
    
    public User VerifyUser(string keycloakId)
    {
        User user = _userRepository.GetUserByKeycloakId(keycloakId);

        if (user == null)
            user = _userRepository.CreateUser(keycloakId);
        
        return user;
    }
}