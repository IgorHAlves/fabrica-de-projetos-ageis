using Microsoft.AspNetCore.Mvc;
using Pix;


namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly PixService _pixService;

    public PaymentController(PixService pixService)
    {
        _pixService = pixService;
    }

    [HttpPost(nameof(CreatePix))]
    public ActionResult CreatePix([FromBody] decimal value, Guid orderId)
    {
        try
        {
            string paymentPix = _pixService.CreatePix(value, orderId.ToString().Replace("-", "").Substring(0, 25));
            if (string.IsNullOrEmpty(paymentPix))
            {
                return BadRequest("Erro ao criar Pix");
            }
            return Ok(paymentPix);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}