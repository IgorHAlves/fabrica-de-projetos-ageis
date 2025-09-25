using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Data;

namespace ECOMMERCE.DATA.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly EcommerceDbContext _ecommerceDbContext;

    public ProductRepository(EcommerceDbContext ecommerceDbContext)
    {
        _ecommerceDbContext = ecommerceDbContext;
    }
    
    public Product CreateProduct(Product product)
    {
        _ecommerceDbContext.Products.Add(product);
        _ecommerceDbContext.SaveChanges();
        return product;
    }
    
    public Product GetProduct(Guid id)
    {
        return _ecommerceDbContext.Products.FirstOrDefault(product => product.Id.Equals(id));
    }

    public List<Product> GetProducts()
    {
        return _ecommerceDbContext.Products.ToList();
    }
}