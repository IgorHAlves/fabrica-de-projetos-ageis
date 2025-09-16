using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IProductRepository 
{
    public Product GetProduct(Guid id);
    public List<Product> GetProducts();
    public Product CreateProduct(Product product);
}