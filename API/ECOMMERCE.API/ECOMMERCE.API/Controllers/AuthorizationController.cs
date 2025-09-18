using ECOMMERCE.API.DTO.Authorization;
using ECOMMERCE.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("[Controller]")]
public class AuthorizationController : ControllerBase
{
    private IAuthorizationService _authorizationService;

    public AuthorizationController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PostTokenDTO dto)
    {
        var retorno = await _authorizationService.PostToken((dto));
        
        return Ok(retorno);
    }
}