using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductController : Controller
{
    private readonly IProductService _productService;
    public ProductController (IProductService productService)
    {
        _productService = productService;
    }
    
    // [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? name, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        Paginator<GetProductDTO> products = _productService.GetProducts(name,pageNumber, pageSize);
        
        return Ok(products);
    }
    
    [HttpGet("{idProduct:guid}")]
    public async Task<IActionResult> GetProduct([FromRoute]  Guid idProduct)
    {
        GetProductDTO product = _productService.GetProduct(idProduct);
        
        return Ok(product);
    }
    
    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult PostProduct([FromBody] CreateProductDTO dto)
    {
        var product = _productService.CreateProduct(dto);
        return Ok(product);
    }
    
    [Authorize(Roles = "admin")]
    [HttpPut("{idProduct:guid}")]
    public IActionResult PutProduct([FromRoute] Guid idProduct,[FromBody] UpdateProductDTO dto)
    {
        var product = _productService.UpdateProduct(idProduct,dto);
        return Ok(product);
    }
    
    [Authorize(Roles = "admin")]
    [HttpDelete("{idProduct:guid}")]

    public IActionResult DeleteProduct([FromRoute] Guid idProduct)
    {
        _productService.DeleteProduct(idProduct);
        
        return Ok();
    }
}