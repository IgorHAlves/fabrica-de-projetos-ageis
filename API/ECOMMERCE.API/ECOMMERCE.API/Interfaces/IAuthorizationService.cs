using ECOMMERCE.API.DTO.Authorization;

namespace ECOMMERCE.API.Interfaces;

public interface IAuthorizationService
{
    public Task<string> PostToken(PostTokenDTO dto);
}