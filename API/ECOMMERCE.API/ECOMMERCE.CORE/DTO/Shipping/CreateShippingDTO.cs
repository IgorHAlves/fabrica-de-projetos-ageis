using ViaCep.DTO;

namespace ECOMMERCE.CORE.DTO.Shipping;

public class CreateShippingDTO
{
    public CreateShippingDTO GetAddresAndRatesDto(ViaCepDto address, decimal rate)
    {
        CreateShippingDTO addresAndRatesDto = new CreateShippingDTO()
        {
            Address = address,
            ShippingRate = rate
        };
        return addresAndRatesDto;
    }
    public decimal ShippingRate { get; set; }
    public ViaCepDto Address { get; set; }
}