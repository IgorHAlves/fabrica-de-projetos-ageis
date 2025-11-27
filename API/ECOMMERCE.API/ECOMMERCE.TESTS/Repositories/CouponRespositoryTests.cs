namespace ECOMMERCE.TESTS.Repositories;

using Xunit;
using ECOMMERCE.DATA.Repositories;
using ECOMMERCE.DATA.Data;
using Microsoft.EntityFrameworkCore;
using ECOMMERCE.CORE.Entity;

public class CouponRepositoryTests
{
    private readonly EcommerceDbContext _context;
    private readonly CouponRepository _repository;

    public CouponRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<EcommerceDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // isolado
            .Options;


        _context = new EcommerceDbContext(options);
        _repository = new CouponRepository(_context);
        
        _context.Database.EnsureDeleted();
        _context.Database.EnsureCreated();

    }

    [Fact]
    public void CreateCoupon_ShouldAddCoupon()
    {
        var coupon = new Coupon { Code = "TESTE1", Value = 10 };

        _repository.CreateCoupon(coupon);

        Assert.Equal(1, _context.Coupons.Count());
    }

    [Fact]
    public void FindCouponByCode_ShouldReturnCoupon()
    {
        var coupon = new Coupon { Code = "C1", Value = 15 };
        _context.Coupons.Add(coupon);
        _context.SaveChanges();

        var result = _repository.FindCouponByCode("C1");

        Assert.NotNull(result);
        Assert.Equal("C1", result.Code);
    }

    [Fact]
    public void DeleteCoupon_ShouldRemoveCoupon()
    {
        var coupon = new Coupon { Code = "DEL" };
        _context.Coupons.Add(coupon);
        _context.SaveChanges();

        _repository.DeleteCoupon(coupon);

        var exists = _context.Coupons.Any(c => c.Id == coupon.Id);
        Assert.False(exists);
    }

    [Fact]
    public void GetCoupons_ShouldReturnPaginated()
    {
        _context.Coupons.Add(new Coupon { Code = "A" });
        _context.Coupons.Add(new Coupon { Code = "B" });
        _context.SaveChanges();

        var result = _repository.GetCoupons(1, 1);

        Assert.Single(result.Items);
        Assert.Equal(2, result.TotalItens);
        Assert.Equal(2, result.TotalPages);
    }
}
