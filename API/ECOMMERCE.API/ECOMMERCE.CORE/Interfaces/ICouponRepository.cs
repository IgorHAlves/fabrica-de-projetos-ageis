using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces;

public interface ICouponRepository
{
    public Coupon FindCouponByCode(string Code);
    public Paginator<Coupon> GetCoupons(int pageNumber, int pageSize);
    public Coupon CreateCoupon(Coupon coupon);
    public void DeleteCoupon(Coupon code);
}