using ECOMMERCE.CORE.Enums;

namespace ECOMMERCE.CORE.Entity;

public class Coupon
{
    public Guid Id { get; set; }
    public string Code { get; set; }
    public int Value { get; set; }
    public CouponCategoryEnum CategoryEnum { get; set; }
}