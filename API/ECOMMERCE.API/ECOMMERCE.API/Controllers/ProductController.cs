using ECOMMERCE.API.DTO.Product;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;
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
    
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? name, [FromQuery] int skip = 0, [FromQuery] int take = 10)
    {
        List<Product> products = _productService.GetProducts(name,skip, take);
        
        return Ok(products);
    }
    
    [HttpGet("{idProduto:guid}")]
    public async Task<IActionResult> GetProduct([FromRoute]  Guid idProduct)
    {
        Product product = _productService.GetProduct(idProduct);
        
        return Ok(product);
    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> PostProduct([FromBody] CreateProductDTO dto)
    {
        Product product = _productService.CreateProduct(dto);
        
        return Ok(product);
    }
}