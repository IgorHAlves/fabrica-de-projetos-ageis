// using ECOMMERCE.CORE.DTO.User;
// using ECOMMERCE.CORE.Interfaces;
// using ECOMMERCE.DATA.Data;
//
// namespace ECOMMERCE.DATA.Repositories;
//
// public class AddressRepository : IAddressRepository
// {
//     private readonly EcommerceDbContext _ecommerceDbContext;
//
//     public AddressRepository(EcommerceDbContext ecommerceDbContext)
//     {
//         _ecommerceDbContext = ecommerceDbContext;
//     }
//
//     public Guid CreateAddress(Address address)
//     {
//         _ecommerceDbContext.Add(Address);
//         _ecommerceDbContext.SaveChanges();
//     }
// }
