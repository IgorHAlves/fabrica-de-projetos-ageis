using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Services;

public class CouponService : ICouponService
{
    private readonly IUserRepository _userRepository;
    private readonly ICouponRepository _couponRepository;

    public CouponService(IUserRepository userRepository, ICouponRepository couponRepository)
    {
        _userRepository = userRepository;
        _couponRepository = couponRepository;
    }
    
    public CreateCouponDTO CreateCoupon(CreateCouponDTO couponDTO)
    {
        try
        {
            var user = _userRepository.GetUserByKeycloakId(couponDTO.UserKeycloackId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            CreateCouponDTO newCoupon = new CreateCouponDTO()
            {
                Code = couponDTO.Code,
                Category = couponDTO.Category,
                Value = couponDTO.Value,
                UserKeycloackId = user.KeycloakId
            };
            return newCoupon;
        }
        catch (Exception e)
        {
            throw new Exception($"Coupon {couponDTO.Code} could not be created.", e);
        }
    }

    public Paginator<Coupon> GetCoupons(int pageNumber, int pageSize)
    {
        throw new NotImplementedException();
    }

    public Coupon FindCouponById(string Code)
    {
        throw new NotImplementedException();
    }
}