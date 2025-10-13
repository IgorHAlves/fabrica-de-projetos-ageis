using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IProductService
{
    public GetProductDTO GetProduct(Guid idProduct);
    public List<GetProductDTO> GetProducts(string? name,int skip, int take);
    public Guid CreateProduct(CreateProductDTO dto);
    public GetProductDTO UpdateProduct(UpdateProductDTO id);
    public Product DeleteProduct(Guid id);
}