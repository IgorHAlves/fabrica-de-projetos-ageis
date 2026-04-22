using System.Net.Http.Headers;
using System.Text.Json;
using ViaCep.DTO;

namespace ViaCep.Rest;
public class ViaCepApi 
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

    public async Task<ViaCepDto?> SearchAsync(string cep)
    {
        var repsonse = await _client.GetAsync($"{cep}/json");

        var content = await repsonse.Content.ReadAsStringAsync();
        
        var address = JsonSerializer.Deserialize<ViaCepDto>(content);
        
        if (!repsonse.IsSuccessStatusCode)
        {
            throw new Exception(content);
        }
        
        return address;
    }

}