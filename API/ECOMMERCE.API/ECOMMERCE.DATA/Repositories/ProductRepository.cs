using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.DATA.Data;
using Microsoft.EntityFrameworkCore;

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
        return _ecommerceDbContext.Products.Include(x => x.Category).FirstOrDefault(product => product.Id.Equals(id));
    }

    public Paginator<Product> GetProducts(string? name, int pageNumber, int pageSize)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        
        IQueryable<Product> products = _ecommerceDbContext.Products.Include(x => x.Category);
        
        if (name != null)
            products = products.Where(product => product.Name.Contains(name));
        
        var listaProducts =  products.OrderBy(product => product.Name)
            .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        var total = products.Count();
        
        var totalItens  = products.Count();
        
        var totalPages = (int)Math.Ceiling((double)totalItens / pageSize);
        
        return new Paginator<Product>()
        {
            ActualPage =  pageNumber,
            TotalItens = totalItens,
            Items = listaProducts,
            TotalPages = totalPages
        };
    }

    public Product UpdateProduct(Guid Id,UpdateProductDTO productDto)
    {
        var product = _ecommerceDbContext.Products.FirstOrDefault(product => product.Id == Id);
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