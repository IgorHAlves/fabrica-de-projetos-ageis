using ECOMMERCE.CORE.DTO.Product;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Repositories;
using Shouldly;
using Xunit;

namespace ECOMMERCE.TESTS.ProductTests;

public class ProductServiceTests
{
    private readonly EcommerceDbContext _context;
    private readonly ProductServices _service;

    public ProductServiceTests()
    {
        _context = TestDbContextFactory.Create();

        var productRepo = new ProductRepository(_context);
        var categoryRepo = new CategoryRepository(_context);
        _service = new ProductServices(productRepo, categoryRepo);
    }

    private Category CreateTestCategory(string name = "Roupas", string description = "Descrição obrigatória")
    {
        var category = new Category
        {
            Name = name,
            Description = description
        };
        _context.Categories.Add(category);
        _context.SaveChanges();
        return category;
    }

    [Fact]
    public void Should_Create_Product()
    {
        // Arrange
        var category = CreateTestCategory();

        var dto = new CreateProductDTO
        {
            Name = "Camiseta Azul",
            Description = "Algodão",
            Price = 59.90m,
            ImageUrl = "https://teste.com/img.png",
            Stock = 10,
            IdCategory = category.Id
        };

        // Act
        Guid productId = _service.CreateProduct(dto);

        // Assert
        var savedProduct = _service.GetProduct(productId);
        savedProduct.ShouldNotBeNull();
        savedProduct.Name.ShouldBe("Camiseta Azul");
        savedProduct.Price.ShouldBe(59.90m);
        savedProduct.IdCategory.ShouldBe(category.Id);
    }

    [Fact]
    public void Should_Update_Product()
    {
        // Arrange
        var category = CreateTestCategory();
        var productId = _service.CreateProduct(new CreateProductDTO
        {
            Name = "Camiseta Vermelha",
            Description = "Algodão",
            Price = 49.90m,
            ImageUrl = "img.png",
            Stock = 5,
            IdCategory = category.Id
        });

        var updateDto = new UpdateProductDTO
        {
            Name = "Camiseta Vermelha Atualizada",
            Description = "Algodão premium",
            Price = 69.90m,
            ImageURL = "img_updated.png",
            Stock = 8,
            CategoryId = category.Id
        };

        // Act
        var updatedProduct = _service.UpdateProduct(productId, updateDto);

        // Assert
        updatedProduct.ShouldNotBeNull();
        updatedProduct.Name.ShouldBe("Camiseta Vermelha Atualizada");
        updatedProduct.Price.ShouldBe(69.90m);
        updatedProduct.Stock.ShouldBe(8);
        updatedProduct.IdCategory.ShouldBe(category.Id);
    }

    [Fact]
    public void Should_Delete_Product()
    {
        // Arrange
        var category = CreateTestCategory();
        var productId = _service.CreateProduct(new CreateProductDTO
        {
            Name = "Produto Para Deletar",
            Description = "Teste",
            Price = 10,
            ImageUrl = "img.png",
            Stock = 1,
            IdCategory = category.Id
        });

        // Act
        _service.DeleteProduct(productId);

        // Assert
        var exception = Should.Throw<Exception>(() => _service.GetProduct(productId));
        exception.Message.ShouldContain("Erro ao exibir produto");
    }

    [Fact]
    public void Should_Get_Products_With_Pagination()
    {
        // Arrange
        var category = CreateTestCategory();
        _service.CreateProduct(new CreateProductDTO
        {
            Name = "Produto 1",
            Description = "Teste 1",
            Price = 10,
            ImageUrl = "img1.png",
            Stock = 1,
            IdCategory = category.Id
        });

        _service.CreateProduct(new CreateProductDTO
        {
            Name = "Produto 2",
            Description = "Teste 2",
            Price = 20,
            ImageUrl = "img2.png",
            Stock = 2,
            IdCategory = category.Id
        });

        // Act
        var products = _service.GetProducts(null, 1, 10);

        // Assert
        products.ShouldNotBeNull();
        products.Items.Count.ShouldBe(2);
        products.Items.Any(p => p.Name == "Produto 1").ShouldBeTrue();
        products.Items.Any(p => p.Name == "Produto 2").ShouldBeTrue();
    }
}
