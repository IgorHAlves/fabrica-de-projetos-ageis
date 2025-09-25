using ECOMMERCE.CORE.DTO.Authorization;

namespace ECOMMERCE.CORE.Interfaces;

public interface IAuthorizationService
{
    public Task<string> PostToken(PostTokenDTO dto);
}