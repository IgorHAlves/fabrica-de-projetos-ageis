using ECOMMERCE.CORE.Interfaces;
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

    [HttpGet("{cep}")]
    public async Task<IActionResult> GetShipping(string cep)
    {
        try
        {
            var address = await _shippingService.GetShipping(cep);
            if (address == null)
            {
                return NotFound($"CEP {cep} não encontrado.");
            }
            return Ok(address);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}