using Xunit;
using Moq;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using System;
using System.Collections.Generic;
using ECOMMERCE.CORE.Enums;

namespace ECOMMERCE.TESTS.Services
{
    public class CouponServiceTests
    {
        private readonly Mock<ICouponRepository> _repoMock;
        private readonly CouponService _service;

        public CouponServiceTests()
        {
            _repoMock = new Mock<ICouponRepository>();
            _service = new CouponService(_repoMock.Object);
        }

        [Fact]
        public void CreateCoupon_ShouldReturnId()
        {
            // Arrange
            var dto = new CreateCouponDTO
            {
                Code = "TESTE10",
                Value = 10,
                CategoryEnum = CORE.Enums.CouponCategoryEnum.percentual
            };

            _repoMock
                .Setup(r => r.CreateCoupon(It.IsAny<Coupon>()))
                .Returns((Coupon c) => c);

            // Act
            var result = _service.CreateCoupon(dto);

            // Assert
            Assert.NotEqual(Guid.Empty, result);
            _repoMock.Verify(r => r.CreateCoupon(It.IsAny<Coupon>()), Times.Once);
        }

        [Fact]
        public void GetCoupons_ShouldReturnMappedPaginator()
        {
            // Arrange
            var coupons = new Paginator<Coupon>
            {
                Items = new List<Coupon>
                {
                    new Coupon { Code = "ABC", Value = 10, CategoryEnum = CouponCategoryEnum.percentual }
                },
                ActualPage = 1,
                TotalItens = 1,
                TotalPages = 1
            };

            _repoMock.Setup(r => r.GetCoupons(1, 10)).Returns(coupons);

            // Act
            var result = _service.GetCoupons(1, 10);

            // Assert
            Assert.Single(result.Items);
            Assert.Equal("ABC", result.Items[0].Code);
        }

        [Fact]
        public void FindCouponByCode_ShouldReturnDto()
        {
            // Arrange
            _repoMock.Setup(r => r.FindCouponByCode("TESTE"))
                .Returns(new Coupon { Code = "TESTE", Value = 20 });

            // Act
            var result = _service.FindCouponByCode("TESTE");

            // Assert
            Assert.Equal("TESTE", result.Code);
            Assert.Equal(20, result.Value);
        }

        [Fact]
        public void DeleteCoupon_ShouldCallRepositoryDelete()
        {
            // Arrange
            var coupon = new Coupon { Code = "TESTE" };
            _repoMock.Setup(r => r.FindCouponByCode("TESTE")).Returns(coupon);

            // Act
            _service.DeleteCoupon("TESTE");

            // Assert
            _repoMock.Verify(r => r.DeleteCoupon(coupon), Times.Once);
        }

        [Fact]
        public void DeleteCoupon_NotFound_ShouldThrowException()
        {
            _repoMock.Setup(r => r.FindCouponByCode("X")).Returns((Coupon)null);

            Assert.Throws<Exception>(() => _service.DeleteCoupon("X"));
        }
    }
}