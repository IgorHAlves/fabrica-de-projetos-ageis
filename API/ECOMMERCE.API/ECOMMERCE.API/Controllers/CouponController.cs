using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpGet(nameof(GetCoupons))]
    public async Task<IActionResult> GetCoupons([FromQuery] int pageNumber = 1,[FromQuery] int pageSize = 10)
    {
        try
        {
            Paginator<GetCouponDTO> couponsList = _couponService.GetCoupons(pageNumber, pageSize);
            return Ok(couponsList);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    [HttpGet(nameof(GetCoupon))]
    public async Task<IActionResult> GetCoupon([FromRoute] string code)
    {
        try
        {
            var coupon = _couponService.FindCouponByCode(code);
            return Ok(coupon);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    [HttpPost(nameof(CreateCoupon))]
    public async Task<IActionResult> CreateCoupon(CreateCouponDTO couponDTO)
    {
        try
        {
            var coupon = _couponService.CreateCoupon(couponDTO);
            return Ok(coupon);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    [HttpDelete(nameof(DeleteCoupon))]
    public async Task<IActionResult> DeleteCoupon([FromRoute] string code)
    {
        try
        {
            _couponService.DeleteCoupon(code);
            return NoContent();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
    
}