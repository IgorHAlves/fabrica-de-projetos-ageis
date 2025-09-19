using ECOMMERCE.API.DTO.Authorization;
using ECOMMERCE.API.Interfaces;

namespace ECOMMERCE.API.Services;

public class AuthorizationService : IAuthorizationService
{
    public async Task<string> PostToken(PostTokenDTO dto)
    {
        using var client = new HttpClient();
        
        var url = "http://localhost:8080/realms/ecommerce/protocol/openid-connect/token";
        
        var bodyRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "password"),
            new KeyValuePair<string, string>("client_id", "ecommerce-api"),
            new KeyValuePair<string, string>("username", dto.Usuario),
            new KeyValuePair<string, string>("password", dto.Senha),
            new KeyValuePair<string, string>("client_secret", "Rrk00vbOvivnMeXwQYYzH1dOc3o7u4pk")
        });
        
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = bodyRequest
        };

        var response = await client.SendAsync(request);
        
        var responseBody = await response.Content.ReadAsStringAsync();
        
        return responseBody;
    }
}