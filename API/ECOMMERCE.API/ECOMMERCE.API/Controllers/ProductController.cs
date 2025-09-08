using ECOMMERCE.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductController : Controller
{
    private readonly IProductService _productController;
    // GET
    public ProductController (IProductService productService)
    {
        _productController = productService;
    }
}