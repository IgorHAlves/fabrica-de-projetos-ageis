using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.DATA.Repositories;

public class ShippingRepository : IShippingRepository
{
    private readonly ViaCepApi _viaCepApi;

    public ShippingRepository(ViaCepApi viaCepApi)
    {
        _viaCepApi = viaCepApi;
    }

    public async Task<HttpResponseMessage?> SearchAsync(string cep)
    {
        return await _viaCepApi.SearchAsync(cep);
    }
}