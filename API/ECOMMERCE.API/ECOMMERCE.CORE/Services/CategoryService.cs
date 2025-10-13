using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;

    public CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository)
    {
        _productRepository = productRepository;
        _categoryRepository= categoryRepository;
    }

    public Category CreateCategory(CreateCategoryDTO dto)
    {
        Category category = new Category();
        category.Name = dto.Name;
        category.Description = dto.Description;
        return category;
    }

    public GetCategoriesDTO GetCategory(Guid id)
    {
        var category = _categoryRepository.GetCategory(id);
        return new GetCategoriesDTO()
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
        };
       
    }

    public List<GetCategoriesDTO> GetCategories()
    { 
        var categories = _categoryRepository.GetCategories();
        return categories.Select(categories => new GetCategoriesDTO
        {
            Id = categories.Id,
            Name = categories.Name,
            Description = categories.Description,
        }).ToList();
        
    }
    
    public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO updateDto )
    {
        var category = _categoryRepository.UpdateCategory(updateDto);
        return new GetCategoriesDTO
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }
    
    public Category DeleteCategory(Guid id)
    {
        var category = _categoryRepository.GetCategory(id);
        var hasProcuct = _productRepository.HasProductByCategoryId(id);
        if (hasProcuct)
        {
            throw new Exception("Não é possivel deletar uma categoria ");
        }
        _categoryRepository.DeleteCategory(id);
        return category;
    }
}