using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Rest;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ShippingController : ControllerBase
{
    private readonly IShippingService _shippingService;

    public ShippingController(IShippingService shippingService)
    {
        _shippingService = shippingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetShipping(string cep)
    {
        try
        {
            var shipping = _shippingService.SearchAsync(cep);
            return Ok(shipping);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}