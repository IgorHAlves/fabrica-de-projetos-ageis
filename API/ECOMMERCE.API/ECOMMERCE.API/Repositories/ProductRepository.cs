using ECOMMERCE.API.Data;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;

namespace ECOMMERCE.API.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly Context _context;

    public ProductRepository(Context context)
    {
        _context = context;
    }
    
    public Product CreateProduct(Product product)
    {
        _context.Products.Add(product);
        //_context.SaveChanges();
        return product;
    }
    
    public Product GetProduct(Guid id)
    {
        return _context.Products.FirstOrDefault(product => product.Id.Equals(id));
    }

    public List<Product> GetProducts()
    {
        return _context.Products.ToList();
    }
}