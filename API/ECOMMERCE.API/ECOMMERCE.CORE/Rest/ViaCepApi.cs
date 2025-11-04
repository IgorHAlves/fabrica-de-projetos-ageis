using System.Net.Http.Headers;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using ECOMMERCE.CORE.DTO;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Rest;

public class ViaCepApi : IViaCep
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

    public async Task<AddressDTO?> SearchAsync(string cep)
    {
        var repsonse = await _client.GetAsync($"{cep}/json");

        var content = await repsonse.Content.ReadAsStringAsync();
        
        var address = JsonSerializer.Deserialize<AddressDTO>(content);
        
        if (!repsonse.IsSuccessStatusCode)
        {
            throw new Exception(content);
        }
        
        return address;
    }

}