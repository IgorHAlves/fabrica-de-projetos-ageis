using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Repositories;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Repositories;
using Shouldly;

namespace ECOMMERCE.TESTS.OrderTests;

public class OrderServiceTests
{
    private readonly EcommerceDbContext _context;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _context = TestDbContextFactory.Create();

        var orderRepo = new OrderRepository(_context);
        var productRepo = new ProductRepository(_context);
        var userRepo = new UserRepository(_context);

        _service = new OrderService(orderRepo, productRepo, userRepo);
    }

    // ---------------------------------------------------------
    // 1 - Create Order
    // ---------------------------------------------------------
    [Fact]
    public void Should_Create_Order()
    {
        // Arrange
        var user = new User()
        {
            Id = Guid.NewGuid(),
            KeycloakId = "abc123"
        };

        _context.Users.Add(user);

        var category = new Category()
        {
            Id = Guid.NewGuid(),
            Name = "Camisetas",
            Description = "Camisetas de algodão"
        };

        var product = new CORE.Entity.Product()
        {
            Id = Guid.NewGuid(),
            Name = "Camiseta",
            Description = "Branca",
            Price = 50,
            Stock = 10,
            ImageUrl = "img.png",
            Category = category
        };

        _context.Products.Add(product);
        _context.SaveChanges();

        var dto = new CreateOrderDTO()
        {
            UserKeycloackId = user.KeycloakId,
            OrderItems = new List<OrderItemDTO>()
            {
                new OrderItemDTO
                {
                    ProductId = product.Id,
                    Quantity = 2
                }
            }
        };

        // Act
        var orderId = _service.CreateOrder(dto);
        var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);

        // Assert
        order.ShouldNotBeNull();
        order.UserId.ShouldBe(user.Id);
        order.Price.ShouldBe(100); 
        order.OrderItems.Count.ShouldBe(1);
        order.OrderItems.First().Quantity.ShouldBe(2);
    }

    // ---------------------------------------------------------
    // 2 - Get Order By Id
    // ---------------------------------------------------------
    [Fact]
    public void Should_Get_Order_By_Id()
    {
        // Arrange
        var user = new User()
        {
            Id = Guid.NewGuid(),
            KeycloakId = "abc999"
        };
        
        var category = new Category()
        {
            Id = Guid.NewGuid(),
            Name = "Tenis",
            Description = "Categoria destinada a tenis"
        };

        var product = new CORE.Entity.Product()
        {
            Id = Guid.NewGuid(),
            Name = "Tênis Nike",
            Description = "Tênis azul",
            Price = 200,
            ImageUrl = "tenis.png",
            Stock = 5,
            Category = category
        };

        _context.Users.Add(user);
        _context.Products.Add(product);
        _context.SaveChanges();

        var order = new Order()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            Price = 200,
            Date = DateTime.Now,
            OrderItems = new List<OrderItem>()
            {
                new OrderItem()
                {
                    Product = product,
                    ProductId = product.Id,
                    Price = 200,
                    Quantity = 1
                }
            }
        };

        _context.Orders.Add(order);
        _context.SaveChanges();

        // Act
        var dto = _service.GetOrder(order.Id);

        // Assert
        dto.ShouldNotBeNull();
        dto.Id.ShouldBe(order.Id);
        dto.Products.Count.ShouldBe(1);
        dto.Products.First().ProductName.ShouldBe("Tênis Nike");
        dto.OrderPrice.ShouldBe(200);
    }

    // ---------------------------------------------------------
    // 3 - Get Orders (List + Pagination)
    // ---------------------------------------------------------
    [Fact]
    public void Should_Get_Orders()
    {
        // Arrange
        var user = new User()
        {
            Id = Guid.NewGuid(),
            KeycloakId = "xyz000"
        };
        
        var category = new Category()
        {
            Id = Guid.NewGuid(),
            Name = "Bermudas",
            Description = "Categoria destinada a bermudas"
        };

        var product = new CORE.Entity.Product()
        {
            Id = Guid.NewGuid(),
            Name = "Bermuda",
            Description = "Bermuda jeans",
            Price = 80,
            ImageUrl = "bermuda.png",
            Stock = 10,
            Category = category
        };

        _context.Users.Add(user);
        _context.Products.Add(product);
        _context.SaveChanges();

        var order1 = new Order()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            Price = 80,
            Date = DateTime.Now,
            OrderItems = new()
            {
                new OrderItem
                {
                    Product = product,
                    ProductId = product.Id,
                    Price = 80,
                    Quantity = 1
                }
            }
        };

        var order2 = new Order()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            Price = 160,
            Date = DateTime.Now,
            OrderItems = new()
            {
                new OrderItem
                {
                    Product = product,
                    ProductId = product.Id,
                    Price = 80,
                    Quantity = 2
                }
            }
        };

        _context.Orders.AddRange(order1, order2);
        _context.SaveChanges();

        // Act
        var result = _service.GetOrders(0, 10);

        // Assert
        result.Items.Count.ShouldBe(2);
        result.Items.Any(o => o.Id == order1.Id).ShouldBeTrue();
        result.Items.Any(o => o.Id == order2.Id).ShouldBeTrue();
    }
}
