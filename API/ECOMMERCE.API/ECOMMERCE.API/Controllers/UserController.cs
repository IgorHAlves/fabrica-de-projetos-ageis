using System.Security.Claims;
using ECOMMERCE.CORE.DTO.User;
using ECOMMERCE.CORE.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> VerifyUser()
    {
        string keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        
        GetUserDTO userLogin = _userService.VerifyUser(keycloakId);

        return Ok(userLogin);
    }
    
    [Authorize]
    [HttpPost("Address")]
    public async Task<IActionResult> CreateAddress([FromBody] CreateAddressDTO address)
    {
        string keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        
        Guid addressId = _userService.CreateAddress(keycloakId,address);

        return Ok(addressId);
    }
    
}