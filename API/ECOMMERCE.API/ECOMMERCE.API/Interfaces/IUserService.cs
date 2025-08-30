using ECOMMERCE.API.DTO.User;

namespace ECOMMERCE.API.Interfaces
{
    public interface IUserService
    {
        public GetUserDto GetUser(int userId);
        
        public int CreateUser(CreateUserDTO user);
    }
}
