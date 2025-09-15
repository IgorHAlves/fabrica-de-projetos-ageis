using ECOMMERCE.API.DTO.User;

namespace ECOMMERCE.API.Interfaces
{
    public interface IUserService
    {
        public GetUserDTO GetUser(Guid userId);
        public List<GetUserDTO> GetUsers(string name,int skip, int take); 
        public int CreateUser(CreateUserDTO user);
    }
}
