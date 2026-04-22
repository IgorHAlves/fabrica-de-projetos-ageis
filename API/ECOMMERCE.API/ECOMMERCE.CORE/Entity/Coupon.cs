using ECOMMERCE.CORE.Enums;

namespace ECOMMERCE.CORE.Entity;

public class Coupon : BaseEntity
{
    public string Code { get; set; }
    public int Value { get; set; }
    public CouponCategoryEnum CategoryEnum { get; set; }
}