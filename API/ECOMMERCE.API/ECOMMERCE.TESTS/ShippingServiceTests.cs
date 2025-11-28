using ECOMMERCE.CORE.DTO.Shipping;
using ECOMMERCE.CORE.Services;
using Shouldly;
using ViaCep.Rest;
using Moq;
using ViaCep.DTO;

namespace ECOMMERCE.TESTS;

public class ShippingServiceTests
{
    private readonly Mock<ViaCepApi> _viaCepApiMock;
    private readonly ShippingService _service;

    public ShippingServiceTests()
    {
        _viaCepApiMock = new Mock<ViaCepApi>();
        _service = new ShippingService(_viaCepApiMock.Object);
    }

     [Fact]
    public async Task Should_Return_Shipping_Rate_By_State()
    {
        // Arrange
        string cep = "01001000";
        
        _viaCepApiMock
            .Setup(api => api.SearchAsync(cep))
            .ReturnsAsync(new ViaCepDto()
            {
                uf = "SP",
                logradouro = "Praça da Sé",
                bairro = "Sé"
            });

        // Act
        var result = await _service.GetShipping(cep);

        // Assert
        result.ShouldNotBeNull();
        result.Address.uf.ToUpper().ShouldBe("SP");
        result.ShippingRate.ShouldBe(10.00m); // valor da tabela de frete
    }
    
    [Fact]
    public async Task Should_Throw_When_Address_Not_Found()
    {
        // Arrange
        string cep = "99999999";

        _viaCepApiMock
            .Setup(api => api.SearchAsync(cep))
            .ReturnsAsync((ViaCepDto?)null);

        // Act & Assert
        var ex = await Should.ThrowAsync<Exception>(async () =>
        {
            await _service.GetShipping(cep);
        });

        ex.Message.ShouldContain("Invalid address");
    }

    [Fact]
    public async Task Should_Throw_When_Address_Uf_Is_Null()
    {
        // Arrange
        _viaCepApiMock
            .Setup(api => api.SearchAsync("00000000"))
            .ReturnsAsync(new ViaCepDto()
            {
                uf = ""
            });

        // Act & Assert
        var ex = await Should.ThrowAsync<Exception>(async () =>
        {
            await _service.GetShipping("00000000");
        });

        ex.Message.ShouldContain("Invalid address");
    }


    [Fact]
    public async Task Should_Throw_When_State_Not_In_Table()
    {
        // Arrange
        string cep = "22222222";

        _viaCepApiMock
            .Setup(api => api.SearchAsync(cep))
            .ReturnsAsync(new ViaCepDto()
            {
                uf = "ZZ" // estado inexistente
            });

        // Act & Assert
        var ex = await Should.ThrowAsync<Exception>(async () =>
        {
            await _service.GetShipping(cep);
        });

        ex.Message.ShouldContain("não encontrado na tabela de fretes");
    }


    [Theory]
    [InlineData("SP", 10.00)]
    [InlineData("RJ", 12.50)]
    [InlineData("MG", 11.00)]
    [InlineData("AM", 18.00)]
    [InlineData("RS", 14.00)]
    public async Task Should_Return_Correct_Rate_For_States(string uf, decimal expectedRate)
    {
        // Arrange
        _viaCepApiMock
            .Setup(api => api.SearchAsync(It.IsAny<string>()))
            .ReturnsAsync(new ViaCepDto()
            {
                uf = uf,
                logradouro = "Cidade Teste"
            });

        // Act
        var result = await _service.GetShipping("11111111");

        // Assert
        result.Address.uf.ToUpper().ShouldBe(uf);
        result.ShippingRate.ShouldBe(expectedRate);
    }
}