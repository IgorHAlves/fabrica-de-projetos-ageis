using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IProductRepository 
{
    public Product GetProduct(Guid id);
    public List<Product> GetProducts();
    public Product CreateProduct(Product product);
}