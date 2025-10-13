using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class ProductServices : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductServices(IProductRepository productRepository)
    {
        _productRepository = productRepository;
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

    public List<GetProductDTO> GetProducts(string? name, int skip, int take)
    {
        var products = _productRepository.GetProducts(name, skip, take);
        return products.Select(products => new GetProductDTO
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

    }

    public Guid CreateProduct(CreateProductDTO dto)
    {
        try
        {
            Product product = new Product();
            product.Id = Guid.NewGuid();
            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.ImageUrl = dto.ImageUrl;
            product.Stock = dto.Stock;
            
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