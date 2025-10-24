using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces;

public interface ICouponService
{
    public Guid CreateCoupon(Coupon coupon);
    public Paginator<GetCouponDTO> GetCoupons(int pageNumber, int pageSize);
    public GetCouponDTO FindCouponByCode(string Code);
    public void DeleteCoupon(string code);
}