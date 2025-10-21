using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Enums;

namespace ECOMMERCE.CORE.DTO.Coupon;

public class GetCouponDTO
{
    public static GetCouponDTO AutoMapGetCouponDto(Entity.Coupon coupon)
    {
        GetCouponDTO getCouponDto = new GetCouponDTO()
        {
            Code = coupon.Code,
            Value = coupon.Value,
            CategoryEnum = coupon.CategoryEnum
        };  
        return getCouponDto;
    }
    public string Code { get; set; }
    public int Value { get; set; }
    public CouponCategoryEnum CategoryEnum { get; set; }
}