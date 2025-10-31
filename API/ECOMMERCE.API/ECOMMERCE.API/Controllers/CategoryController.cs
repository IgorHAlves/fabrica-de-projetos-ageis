using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : Controller
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // [Authorize]
    [HttpGet("id:guid")]
    public IActionResult GetCategory([FromRoute] Guid id)
    {
        GetCategoriesDTO getCategory = _categoryService.GetCategory(id);
        return Ok(getCategory);
    }

    [HttpGet]
    public IActionResult GetCategories([FromQuery] string? name, [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        Paginator<GetCategoriesDTO> getCategoriesList = _categoryService.GetCategories(name, pageNumber, pageSize);
        return Ok(getCategoriesList);
    }

    [HttpPost]
    public IActionResult PostCategory([FromBody] CreateCategoryDTO dto)
    {
        var category = _categoryService.CreateCategory(dto);
        return Ok(category);
    }

    [HttpPut]
    public IActionResult PutCategory([FromBody] UpdateCategoriesDTO dto)
    {
        var updateCategory = _categoryService.UpdateCategory(dto);
        return Ok(updateCategory);
    }

    [HttpDelete("id:guid")]
    public IActionResult DeleteCategory([FromRoute] Guid id)
    {
        var deleteCategory = _categoryService.DeleteCategory(id);
        return Ok(deleteCategory);
    }
}