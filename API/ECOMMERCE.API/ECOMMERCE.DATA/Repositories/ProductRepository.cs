using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Entity;
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

    public bool HasProductByCategoryId(Guid categoryId)
    {
        return _ecommerceDbContext.Products.Any(product => product.CategoryId == categoryId);
    }

    public Product GetProduct(Guid id)
    {
        return _ecommerceDbContext.Products.FirstOrDefault(product => product.Id.Equals(id));
    }

    public List<Product> GetProducts(string? name, int skip, int take)
    {
        var products = _ecommerceDbContext.Products.AsQueryable();
       
        var lista =  products.OrderBy(product => product.Name)
            .Skip(skip).Take(take).ToList();
        var total = products.Count();
        
       

    }

    public Product UpdateProduct(UpdateProductDTO productDto)
    {
        var product = _ecommerceDbContext.Products.FirstOrDefault(product => product.Id == productDto.Id);
        if (product == null)
        {
            throw new Exception("Produto não encontrado");
        }
        product.Name = productDto.Name;
        product.CategoryId = productDto.CategoryId;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.IdPai = productDto.IdPai;
        product.ImageUrl = productDto.ImageURL;
        product.Stock = productDto.Stock;
        
        _ecommerceDbContext.Products.Update(product);
        _ecommerceDbContext.SaveChanges();
        return product;
    }

    public void DeleteProduct(Guid id)
    {
        var deletePoduct = _ecommerceDbContext.Products.FirstOrDefault(product => product.Id.Equals(id));
        _ecommerceDbContext.Products.Remove(deletePoduct);
        _ecommerceDbContext.SaveChanges();
    }
}