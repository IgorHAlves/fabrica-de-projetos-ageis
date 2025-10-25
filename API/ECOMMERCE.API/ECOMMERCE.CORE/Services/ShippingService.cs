using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.CORE.Services;

public class ShippingService : IShippingService
{
    private readonly IShippingRepository _shippingRepository;

    public ShippingService(IShippingRepository shippingRepository)
    {
        _shippingRepository = shippingRepository;
    }

    public async Task<HttpResponseMessage?> SearchAsync(string cep)
    {
        return await _shippingRepository.SearchAsync(cep);
    }



}