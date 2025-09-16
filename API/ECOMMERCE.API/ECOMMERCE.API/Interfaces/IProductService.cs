using ECOMMERCE.API.DTO.Product;
using ECOMMERCE.API.Entity;

namespace ECOMMERCE.API.Interfaces;

public interface IProductService
{
    public Product GetProduct(Guid idProduct);
    public List<Product> GetProducts(string name,int skip, int take);
    public Product CreateProduct(CreateProductDTO dto);
}