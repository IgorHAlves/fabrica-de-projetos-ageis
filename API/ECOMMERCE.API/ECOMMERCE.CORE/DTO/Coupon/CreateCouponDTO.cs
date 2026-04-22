using ECOMMERCE.CORE.Enums;

namespace ECOMMERCE.CORE.DTO.Coupon;

public class CreateCouponDTO
{
    public string Code { get; set; }
    public int Value { get; set; }
    public CouponCategoryEnum CategoryEnum { get; set; }
}