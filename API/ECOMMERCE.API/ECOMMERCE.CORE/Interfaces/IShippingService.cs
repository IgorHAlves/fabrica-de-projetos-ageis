using ECOMMERCE.CORE.DTO;
using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.CORE.Interfaces;

public interface IShippingService
{
    public Task<AddressDTO?> SearchAsync(string cep);
}