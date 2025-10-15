using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class ProductServices : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    public ProductServices(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public GetProductDTO GetProduct(Guid idProduct)
    {
        try
        {
            Product product = _productRepository.GetProduct(idProduct);
            return new GetProductDTO()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                IdCategory = product.CategoryId,
                IdPai = product.IdPai,
                Stock =  product.Stock,
            };
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao exibir produto" + ex.Message);
        }
    }

    public Paginator<GetProductDTO> GetProducts(string? name, int skip, int take)
    {
        var products = _productRepository.GetProducts(name, skip, take);
        
        Paginator<GetProductDTO> dtoRetorno = new Paginator<GetProductDTO>();
        
        dtoRetorno.Items = products.Items.Select(products => new GetProductDTO
        {
            Id = products.Id,
            Name = products.Name,
            Description = products.Description,
            Price = products.Price,
            ImageUrl = products.ImageUrl,
            IdCategory = products.CategoryId,
            IdPai = products.IdPai,
            Stock = products.Stock
        }).ToList();
        
        dtoRetorno.ActualPage = products.ActualPage;
        dtoRetorno.TotalPages = products.TotalPages;
        dtoRetorno.TotalItens = products.TotalItens;

        return dtoRetorno;

    }

    public Guid CreateProduct(CreateProductDTO dto)
    {
        try
        {
           Category category = _categoryRepository.GetCategory(dto.IdCategory);
            
            Product product = new Product();
            product.Id = Guid.NewGuid();
            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.ImageUrl = dto.ImageUrl;
            product.Stock = dto.Stock;
            product.Category = category;
            
            if (dto.IdPai != null)
                product.IdPai = Guid.Parse(dto.IdPai);
                
            Product newProduct = _productRepository.CreateProduct(product);
            return newProduct.Id;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao criar produto" + ex.Message);
        }
    }

    public GetProductDTO UpdateProduct(UpdateProductDTO dto)
    { 
        var product = _productRepository.UpdateProduct(dto);
        return new GetProductDTO
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            IdCategory = product.CategoryId,
            IdPai = product.IdPai,
            Stock = product.Stock
        };
    }

    public Product DeleteProduct(Guid id)
    {
        var deleteProduct = _productRepository.GetProduct(id);
        _productRepository.DeleteProduct(id);
        return deleteProduct;
    }

}