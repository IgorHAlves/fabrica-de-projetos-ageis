using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces;

public interface IProductRepository 
{
    public Product GetProduct(Guid id);
    public Paginator<Product> GetProducts(string? name, int skip, int take);
    public Product CreateProduct(Product product);
    public bool HasProductByCategoryId(Guid categoryId);
    public Product UpdateProduct(Guid Id,UpdateProductDTO dto);
    public void DeleteProduct(Guid id);
}