using System.Text.Json;
using ECOMMERCE.CORE.DTO;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces;

public interface IViaCep
{
    public Task<AddressDTO?> SearchAsync(string cep);
}