using ECOMMERCE.CORE.DTO.Shipping;

namespace ECOMMERCE.CORE.Interfaces;

public interface IShippingService
{ 
    public Task<CreateShippingDTO> GetShipping(string cep);
}