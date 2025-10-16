using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces;

public interface ICouponService
{
    public CreateCouponDTO CreateCoupon(CreateCouponDTO coupoTO);
    public Paginator<Coupon> GetCoupons(int pageNumber, int pageSize);
    public Coupon FindCouponById(string Code);
}