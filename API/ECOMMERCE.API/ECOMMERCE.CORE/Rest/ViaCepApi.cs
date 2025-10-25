using System.Net.Http.Headers;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Rest;

public class ViaCepApi : IViaCEP
{
    private readonly HttpClient _client;

    public ViaCepApi()
    {
        _client = new HttpClient()
        {
            BaseAddress = new Uri("https://viacep.com.br/ws/")
        };
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<HttpResponseMessage?> SearchAsync(string cep)
    {
        var repsonse = await _client.GetAsync($"{cep}/json");

        if (!repsonse.IsSuccessStatusCode)
        {
            throw new Exception(repsonse.ReasonPhrase);
        }
        
        var content = await repsonse.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<HttpResponseMessage>(content);
    }

}