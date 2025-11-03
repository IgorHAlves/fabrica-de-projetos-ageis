using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using NotImplementedException = System.NotImplementedException;

namespace ECOMMERCE.CORE.Services;

public class CouponService : ICouponService
{
    private readonly ICouponRepository _couponRepository;

    public CouponService(ICouponRepository couponRepository)
    {
        _couponRepository = couponRepository;
    }
    
    public Guid CreateCoupon(CreateCouponDTO couponDTO)
    {
        try
        {
            Coupon newCoupon = new Coupon()
            {
                Code = couponDTO.Code,
                CategoryEnum = couponDTO.CategoryEnum,
                Value = couponDTO.Value
            };
            var coupon = _couponRepository.CreateCoupon(newCoupon);
            
            return newCoupon.Id;
        }
        catch (Exception e)
        {
            throw new Exception($"Coupon {couponDTO.Code} could not be created.", e);
        }
    }

    public Paginator<GetCouponDTO> GetCoupons(int pageNumber, int pageSize)
    {
        try
        { 
            Paginator<Coupon> coupons = _couponRepository.GetCoupons(pageNumber, pageSize);
            List<GetCouponDTO> getCouponListDTO = new List<GetCouponDTO>();
            if (coupons.Items == null)
            {
                throw new Exception($"Coupons not found");
            }
            
            foreach (Coupon coupon in coupons.Items)
            {
                getCouponListDTO.Add(GetCouponDTO.AutoMapGetCouponDto(coupon));
            }
            
            return new Paginator<GetCouponDTO>()
            {
                Items = getCouponListDTO,
                ActualPage = coupons.ActualPage,
                TotalItens = coupons.TotalItens,
                TotalPages = coupons.TotalPages
            };
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public GetCouponDTO FindCouponByCode(string Code)
    {
        Coupon coupon = _couponRepository.FindCouponByCode(Code);

        GetCouponDTO couponDTO = GetCouponDTO.AutoMapGetCouponDto(coupon);
        
        return couponDTO;
    }

    public void DeleteCoupon(string code)
    {
        try
        {
            Coupon? coupon = _couponRepository.FindCouponByCode(code);
            if (coupon == null)
            {
                throw new Exception($"Coupon {code} could not be deleted");
            }
            _couponRepository.DeleteCoupon(coupon);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}