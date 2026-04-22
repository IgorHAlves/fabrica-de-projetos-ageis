using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
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

    public Guid CreateCategory(CreateCategoryDTO dto)
    {
        try
        {
            Category newCategory = new Category();
            newCategory.Name = dto.Name;
            newCategory.Description = dto.Description;

            Category category = _categoryRepository.CreateCategory(newCategory); 
            return category.Id;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao criar categoria",  ex);
        }
        
    }

    public GetCategoriesDTO GetCategory(Guid id)
    {
        var category = _categoryRepository.GetCategory(id);

        List<GetProductDTO> products = new List<GetProductDTO>();
        
        foreach (var product in category.Products)
        {
            products.Add(new  GetProductDTO()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                IdCategory = product.CategoryId,
                IdPai = product.IdPai,
                Stock = product.Stock
            });
        }
        return new GetCategoriesDTO()
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Products = products
        };
       
    }

    public Paginator<GetCategoriesDTO> GetCategories(string? name, int pageNumber, int pageSize)
    { 
        var categories = _categoryRepository.GetCategories(name,pageNumber, pageSize);

        Paginator<GetCategoriesDTO> retornoDTO = new Paginator<GetCategoriesDTO>();
        
        retornoDTO.Items = categories.Items.Select(categories =>  new GetCategoriesDTO
        {
            Id = categories.Id,
            Name = categories.Name,
            Description = categories.Description,
            Products = categories.Products.Select(x => new GetProductDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                ImageUrl = x.ImageUrl,
                IdCategory = x.CategoryId,
                IdPai = x.IdPai,
                Stock = x.Stock
            }).ToList()
        }).ToList();

        retornoDTO.ActualPage = categories.ActualPage;
        retornoDTO.TotalItens = categories.TotalItens;
        retornoDTO.TotalPages =  categories.TotalPages;

        return retornoDTO;
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