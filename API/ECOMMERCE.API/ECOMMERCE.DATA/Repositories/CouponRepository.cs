using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Data;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.DATA.Repositories;

public class CouponRepository : ICouponRepository
{
    private readonly EcommerceDbContext _context;
    
    public CouponRepository(EcommerceDbContext context)
    {
        _context = context;
    }
    
    public Paginator<Coupon> GetCoupons(int pageNumber, int pageSize)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        
        var query = _context.Coupons.AsQueryable();
        
        var list = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var total = query.Count();
        
        var totalPages = (int)Math.Ceiling((double)total / pageSize);

        return new Paginator<Coupon>()
        {
            Items = list,
            TotalItens = total,
            TotalPages = totalPages
        };
    }
    
    public Coupon FindCouponByCode(string Code)
    {
        return _context.Coupons.FirstOrDefault(coupon => coupon.Code == Code);
    }
    
    public Coupon CreateCoupon(Coupon coupon)
    {
        _context.Coupons.Add(coupon);
        _context.SaveChanges();
        return coupon;
    }

    public void DeleteCoupon(Coupon code)
    {
        _context.Coupons.Remove(code);
        _context.SaveChanges();
    }
}