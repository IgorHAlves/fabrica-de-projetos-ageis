namespace ECOMMERCE.TESTS.Controller;

using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using ECOMMERCE.API.Controllers;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.DTO.Coupon;
using ECOMMERCE.CORE.Helper;
using System.Collections.Generic;

public class CouponControllerTests
{
    private readonly Mock<ICouponService> _serviceMock;
    private readonly CouponController _controller;

    public CouponControllerTests()
    {
        _serviceMock = new Mock<ICouponService>();
        _controller = new CouponController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetCoupons_ShouldReturnOk()
    {
        _serviceMock.Setup(s => s.GetCoupons(1, 10))
            .Returns(new Paginator<GetCouponDTO>
            {
                Items = new List<GetCouponDTO>()
            });

        var result = await _controller.GetCoupons(1, 10);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetCoupon_ShouldReturnOkWithFoundItem()
    {
        _serviceMock.Setup(s => s.FindCouponByCode("A"))
            .Returns(new GetCouponDTO { Code = "A" });

        var result = await _controller.GetCoupon("A") as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal("A", (result.Value as GetCouponDTO).Code);
    }

    [Fact]
    public async Task CreateCoupon_ShouldReturnOk()
    {
        _serviceMock.Setup(s => s.CreateCoupon(It.IsAny<CreateCouponDTO>()))
            .Returns(Guid.NewGuid());

        var result = await _controller.CreateCoupon(new CreateCouponDTO());

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task DeleteCoupon_ShouldReturnNoContent()
    {
        var result = await _controller.DeleteCoupon("TESTE");

        Assert.IsType<NoContentResult>(result);
    }
}
