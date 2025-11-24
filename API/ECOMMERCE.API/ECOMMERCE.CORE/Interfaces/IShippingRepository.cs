using ECOMMERCE.CORE.Rest;

namespace ECOMMERCE.CORE.Interfaces;

public interface IShippingRepository
{
    public Task<HttpResponseMessage?> SearchAsync(string cep);
}