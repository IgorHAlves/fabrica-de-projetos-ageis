using ECOMMERCE.API.DTO.Product;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;

namespace ECOMMERCE.API.Services;

public class ProductServices : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductServices(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public Product GetProduct(Guid idProduct)
    {
        try
        {
            Product product = _productRepository.GetProduct(idProduct);
            return product;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao exibir produto" + ex.Message);
        }
    }

    public List<Product> GetProducts(string? name, int skip, int take)
    {
        var products = _productRepository.GetProducts();
        if (!string.IsNullOrEmpty(name))
        {
            products = products
                .Where(product => product.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
        return products.Skip(skip).Take(take).ToList();;
    
        
    }

    public Product CreateProduct(CreateProductDTO dto)
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
            return newProduct;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao criar produto" + ex.Message);
        }
    }
}