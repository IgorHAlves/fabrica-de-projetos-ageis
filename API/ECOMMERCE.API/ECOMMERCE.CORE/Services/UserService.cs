using ECOMMERCE.CORE.DTO.User;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository =  userRepository;
    }
    
    public GetUserDTO VerifyUser(string keycloakId)
    {
        User user = _userRepository.GetUserByKeycloakId(keycloakId);

        if (user == null)
            user = _userRepository.CreateUser(keycloakId);

        GetUserDTO userDTO = new GetUserDTO()
        {
            Id = user.Id,
            keycloakId = user.KeycloakId
        };
        
        return userDTO;
    }

    public Guid CreateAddress(string keycloakId, CreateAddressDTO address)
    {
        Address newAddress = new Address()
        {
            Cep = address.CEP,
            Logradouro = address.Street,
            Number = address.Number
        };
        
        Guid addresId = _userRepository.CreateAddress(keycloakId, newAddress);
        return addresId;
    }

}