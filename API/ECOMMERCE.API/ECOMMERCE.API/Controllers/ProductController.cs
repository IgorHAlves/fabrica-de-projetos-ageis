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
    public async Task<IActionResult> GetProducts([FromQuery] string? name, [FromQuery] int skip = 0, [FromQuery] int take = 10)
    {
        Paginator<GetProductDTO> products = _productService.GetProducts(name,skip, take);
        
        return Ok(products);
    }
    
    [HttpGet("{idProduct:guid}")]
    public async Task<IActionResult> GetProduct([FromRoute]  Guid idProduct)
    {
        GetProductDTO product = _productService.GetProduct(idProduct);
        
        return Ok(product);
    }
    
    // [Authorize]
    [HttpPost]
    public IActionResult PostProduct([FromBody] CreateProductDTO dto)
    {
        var product = _productService.CreateProduct(dto);
        return Ok(product);
    }
    
    // [Authorize]
    [HttpPut]
    public IActionResult PutProduct([FromBody] UpdateProductDTO dto)
    {
        var product = _productService.UpdateProduct(dto);
        return Ok(product);
    }
    
    // [Authorize]
    [HttpDelete("{id:guid}")]
    public IActionResult DeleteProduct([FromRoute] Guid idProduct)
    {
        Product deleteProduct = _productService.DeleteProduct(idProduct);
        return Ok(deleteProduct);
    }
}