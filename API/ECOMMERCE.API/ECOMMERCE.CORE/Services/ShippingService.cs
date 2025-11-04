using ECOMMERCE.CORE.DTO;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.CORE.Services;

public class ShippingService : IShippingService
{
    private readonly IViaCep _viaCep;

    public ShippingService(IViaCep viaCep)
    {
        _viaCep = viaCep;
    }

    public async Task<AddressDTO?> SearchAsync(string cep)
    {
        
        return await _viaCep.SearchAsync(cep);
    }



}