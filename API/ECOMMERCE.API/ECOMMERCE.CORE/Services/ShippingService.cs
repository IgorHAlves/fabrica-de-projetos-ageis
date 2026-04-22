using ECOMMERCE.CORE.DTO.Shipping;
using ECOMMERCE.CORE.Interfaces;
using ViaCep.Rest;


namespace ECOMMERCE.CORE.Services;

public class ShippingService : IShippingService
{
    private readonly ViaCepApi _viaCepApi;

    public ShippingService(ViaCepApi viaCepApi)
    {
        _viaCepApi = viaCepApi;
    }
    
    public static class ShippingRates
    {
        public static readonly Dictionary<string, decimal> RatesByState = new()
        {
            { "SP", 10.00m },
            { "RJ", 12.50m },
            { "MG", 11.00m },
            { "RS", 14.00m },
            { "BA", 13.50m },
            { "PE", 15.00m },
            { "CE", 14.50m },
            { "PR", 11.50m },
            { "SC", 12.00m },
            { "DF", 13.00m },
            { "GO", 13.00m },
            { "ES", 12.00m },
            { "AM", 18.00m },
            { "PA", 17.00m },
            { "MT", 16.00m },
            { "MS", 15.00m },
            { "TO", 16.00m },
            { "RN", 14.50m },
            { "PB", 14.50m },
            { "AL", 14.50m },
            { "SE", 14.00m },
            { "RO", 17.00m },
            { "AC", 18.50m },
            { "AP", 18.00m },
            { "RR", 19.00m },
            { "PI", 15.00m },
            { "MA", 15.00m }
        };
    }
    public async Task<CreateShippingDTO> GetShipping(string cep)
    {
        var address = await _viaCepApi.SearchAsync(cep);

        if (address == null || string.IsNullOrEmpty(address.uf))
            throw new Exception("Invalid address.");

        var uf = address.uf.ToUpper();

        if (!ShippingRates.RatesByState.TryGetValue(uf, out var rate))
            throw new Exception($"Estado '{uf}' não encontrado na tabela de fretes.");

        CreateShippingDTO shippingDto = new CreateShippingDTO();
        shippingDto = shippingDto.GetAddresAndRatesDto(address, rate);
        
        return shippingDto;
    }
}