using System;
using System.Collections.Generic;
using Moq;
using Xunit;

using ECOMMERCE.CORE.Services;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.TESTS.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly Mock<IUserRepository> _userRepoMock;
        private readonly OrderService _orderService;

        public OrderServiceTests()
        {
            _orderRepoMock = new Mock<IOrderRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _userRepoMock = new Mock<IUserRepository>();

            _orderService = new OrderService(
                _orderRepoMock.Object,
                _productRepoMock.Object,
                _userRepoMock.Object
            );
        }

        // -------------------------------------------------------------
        // TEST 1: USER NOT FOUND
        // -------------------------------------------------------------
        [Fact]
        public void CreateOrder_ShouldThrow_WhenUserNotFound()
        {
            var dto = new CreateOrderDTO
            {
                UserKeycloackId = "X",
                OrderItems = new List<OrderItemDTO>()
            };

            _userRepoMock.Setup(r => r.GetUserByKeycloakId("X"))
                .Returns((User)null);

            var ex = Assert.Throws<Exception>(() => _orderService.CreateOrder(dto));

            Assert.Contains("User not found", ex.Message);
        }

        // -------------------------------------------------------------
        // TEST 2: PRODUCT NOT FOUND
        // -------------------------------------------------------------
        [Fact]
        public void CreateOrder_ShouldThrow_WhenProductNotFound()
        {
            var dto = new CreateOrderDTO
            {
                UserKeycloackId = "abc",
                OrderItems = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductId = Guid.NewGuid(), Quantity = 1 }
                }
            };

            _userRepoMock.Setup(r => r.GetUserByKeycloakId("abc"))
                .Returns(new User { Id = Guid.NewGuid() });

            _productRepoMock.Setup(r => r.GetProduct(It.IsAny<Guid>()))
                .Returns((Product)null);

            var ex = Assert.Throws<Exception>(() => _orderService.CreateOrder(dto));
            Assert.Contains("Product not found", ex.Message);
        }

        // -------------------------------------------------------------
        // TEST 3: CREATE ORDER SUCCESS
        // -------------------------------------------------------------
        [Fact]
        public void CreateOrder_ShouldCreateOrderAndReturnId()
        {
            var user = new User { Id = Guid.NewGuid() };
            var productId = Guid.NewGuid();

            var dto = new CreateOrderDTO
            {
                UserKeycloackId = "ok",
                OrderItems = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductId = productId, Quantity = 2 }
                }
            };

            _userRepoMock.Setup(r => r.GetUserByKeycloakId("ok"))
                .Returns(user);

            _productRepoMock.Setup(r => r.GetProduct(productId))
                .Returns(new Product
                {
                    Id = productId,
                    Price = 50,
                    Name = "Produto Teste",
                    ImageUrl = "img.png"
                });

            var createdOrder = new Order
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                OrderItems = new List<OrderItem>()
            };

            _orderRepoMock.Setup(r => r.CreateOrder(It.IsAny<Order>()))
                .Returns(createdOrder);

            Guid result = _orderService.CreateOrder(dto);

            Assert.Equal(createdOrder.Id, result);
            _orderRepoMock.Verify(r => r.CreateOrder(It.IsAny<Order>()), Times.Once);
        }

        // -------------------------------------------------------------
        // TEST 4: GET ORDERS SUCCESS
        // -------------------------------------------------------------
        [Fact]
        public void GetOrders_ShouldReturnMappedDTO()
        {
            var orderId = Guid.NewGuid();

            var order = new Order
            {
                Id = orderId,
                Price = 80,
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        Quantity = 2,
                        Price = 40,
                        ProductId = Guid.NewGuid(),
                        Product = new Product
                        {
                            Name = "Produto A",
                            Price = 40,
                            ImageUrl = "imgA.png"
                        }
                    }
                }
            };

            var paginator = new Paginator<Order>
            {
                Items = new List<Order> { order },
                ActualPage = 1,
                TotalItens = 1,
                TotalPages = 1
            };

            _orderRepoMock.Setup(r => r.GetOrders(1, 10))
                .Returns(paginator);

            var result = _orderService.GetOrders(1, 10);

            Assert.Single(result.Items);
            Assert.Equal(orderId, result.Items[0].Id);
            Assert.Equal(80, result.Items[0].OrderPrice);
            Assert.Equal(1, result.ActualPage);
        }

        // -------------------------------------------------------------
        // TEST 5: GET ORDER BY ID SUCCESS
        // -------------------------------------------------------------
        [Fact]
        public void GetOrder_ShouldReturnMappedDTO()
        {
            var orderId = Guid.NewGuid();

            var item = new OrderItem
            {
                Quantity = 1,
                Price = 100,
                ProductId = Guid.NewGuid(),
                Product = new Product
                {
                    Name = "Produto X",
                    Price = 100,
                    ImageUrl = "imgx.png"
                }
            };

            var order = new Order
            {
                Id = orderId,
                Price = 100,
                OrderItems = new List<OrderItem> { item }
            };

            _orderRepoMock.Setup(r => r.GetOrder(orderId))
                .Returns(order);

            var result = _orderService.GetOrder(orderId);

            Assert.Equal(orderId, result.Id);
            Assert.Single(result.Products);

            Assert.Equal("Produto X", result.Products[0].ProductName);
            Assert.Equal(100, result.Products[0].ProductPrice);
            Assert.Equal(order.Price, result.OrderPrice);
        }

        // -------------------------------------------------------------
        // TEST 6: CREATEORDER — CATCH BLOCK
        // -------------------------------------------------------------
        [Fact]
        public void CreateOrder_ShouldWrapExceptionInCatchBlock()
        {
            var dto = new CreateOrderDTO
            {
                UserKeycloackId = "u1",
                OrderItems = new List<OrderItemDTO>()
            };

            _userRepoMock
                .Setup(r => r.GetUserByKeycloakId("u1"))
                .Throws(new Exception("Erro no banco"));

            var ex = Assert.Throws<Exception>(() => _orderService.CreateOrder(dto));

            Assert.Contains("Erro ao criar pedido: Erro no banco", ex.Message);
        }

        // -------------------------------------------------------------
        // TEST 7: GETORDERS — CATCH BLOCK
        // -------------------------------------------------------------
        [Fact]
        public void GetOrders_ShouldThrowWrappedException()
        {
            _orderRepoMock.Setup(r => r.GetOrders(1, 10))
                .Throws(new Exception("Erro no repositório"));

            var ex = Assert.Throws<Exception>(() => _orderService.GetOrders(1, 10));

            Assert.Equal("Erro no repositório", ex.Message);
        }
    }
}
