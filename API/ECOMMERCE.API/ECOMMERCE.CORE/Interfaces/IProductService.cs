using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IProductService
{
    public Product GetProduct(Guid idProduct);
    public List<Product> GetProducts(string? name,int skip, int take);
    public Product CreateProduct(CreateProductDTO dto);
}