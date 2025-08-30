using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IProductService
{
    public Product GetProduct(int idProduct);
    public List<Product> GetProducts(int skip, int take);
    public int CreateProduct();
}