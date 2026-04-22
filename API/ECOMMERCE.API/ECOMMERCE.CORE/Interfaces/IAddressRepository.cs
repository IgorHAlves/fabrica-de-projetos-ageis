using ECOMMERCE.CORE.DTO.User;

namespace ECOMMERCE.CORE.Interfaces;

public interface IAddressRepository
{
    public Guid CreateAddress(CreateAddressDTO createAddressDto);
}