using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.CORE.Interfaces;

public interface IShippingService
{
    public Task<HttpResponseMessage?> SearchAsync(string cep);
}