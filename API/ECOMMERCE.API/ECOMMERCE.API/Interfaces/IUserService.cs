using ECOMMERCE.API.DTO.User;

namespace ECOMMERCE.API.Interfaces
{
    public interface IUserService
    {
        public GetUserDTO GetUser(int userId);
        public List<GetUserDTO> GetUsers(int skip, int take); 
        public int CreateUser(CreateUserDTO user);
    }
}
