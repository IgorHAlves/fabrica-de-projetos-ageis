using System.Text.Json;

namespace ECOMMERCE.CORE.Interfaces;

public interface IViaCEP
{
    public Task<HttpResponseMessage?> SearchAsync(string cep);
}