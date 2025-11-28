using Moq;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Enums;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Repositories;
using Shouldly;

namespace ECOMMERCE.TESTS
{
    public class CouponServiceTests
    {
        private readonly EcommerceDbContext _context;
        private readonly CouponService _service;

        public CouponServiceTests()
        {
            _context = TestDbContextFactory.Create();
            
            var couponRepo = new CouponRepository(_context);
            _service = new CouponService(couponRepo);
        }

        [Fact]
        public void Should_CreateCoupon_And_Get_By_Code()
        {
            // Arrange
            var dto = new CreateCouponDTO()
            {
                Code = "TESTE10",
                Value = 10,
                CategoryEnum = CORE.Enums.CouponCategoryEnum.percentual
            };

            // Act
            Guid couponId = _service.CreateCoupon(dto);

            // Assert
            var saved = _service.FindCouponByCode(dto.Code);
            saved.ShouldNotBeNull();
            saved.Code.ShouldBe(dto.Code);
            saved.Value.ShouldBe(dto.Value);
            saved.CategoryEnum.ShouldBe(dto.CategoryEnum);
        }

        [Fact]
        public void Should_get_Coupons_With_Pagination()
        {
            // Arrange
            _context.Coupons.AddRange(new List<Coupon>
            {
                new  Coupon { Code = "ABC", Value = 20 },
                new  Coupon { Code = "ABCD", Value = 30 },
                new  Coupon { Code = "ABCDE", Value = 40 },
            });

            _context.SaveChanges();

            // Act
            var result = _service.GetCoupons(1, 10);

            // Assert
            result.ShouldNotBeNull();
            result.Items.Count.ShouldBe(3);
            result.Items.ShouldContain(x => x.Code == "ABC");
            result.Items.ShouldContain(x => x.Code == "ABCD");
            result.Items.ShouldContain(x => x.Code == "ABCDE");
        }

        [Fact]
        public void Should_Find_Coupon_By_Code()
        {
            // Arrange
            var coupon = new Coupon 
            { 
                Code = "PROMO50",
                Value = 50,
                CategoryEnum = CouponCategoryEnum.totalValue
            };
            
            _context.Coupons.Add(coupon);
            _context.SaveChanges();

            // Act
            var result = _service.FindCouponByCode(coupon.Code);

            // Assert
            result.ShouldNotBeNull();
            result.Code.ShouldBe(coupon.Code);
            result.Value.ShouldBe(coupon.Value);
        }

        [Fact]
        public void Should_Delete_Coupon()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "DELETE10",
                Value = 10,
                CategoryEnum = CouponCategoryEnum.percentual
            };
            
            _context.Coupons.Add(coupon);
            _context.SaveChanges();

            // Act
            _service.DeleteCoupon(coupon.Code);

            // Assert
            var list = _context.Coupons.ToList();
            list.ShouldBeEmpty();
        }

        [Fact]
        public void Should_Throw_Exception_When_Deleting_Nonexistent_Coupon()
        {
            var ex = Should.Throw<Exception>(() =>
            {
                _service.DeleteCoupon("NOTFOUND");
            });
            
            ex.Message.ShouldBe($"Coupon NOTFOUND could not be deleted");
        }
    }
}