using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Repositories;
using Shouldly;

namespace ECOMMERCE.TESTS;

public class CategoryServiceTests
{
    private readonly EcommerceDbContext _context;
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        _context = TestDbContextFactory.Create();

        var categoryRepo = new CategoryRepository(_context);
        var productRepo = new ProductRepository(_context);
        _service = new CategoryService(categoryRepo, productRepo);
    }
    
    [Fact]
    public void Should_Create_Category_And_Get_Category_By_Id()
    {
        //Arrange
        var dto = new CreateCategoryDTO()
        {
            Name = "Camisetas",
            Description = "Camisetas de algodão",
        };
        
        //Act
        Guid categoryId = _service.CreateCategory(dto);
        
        //Assert
        var savedCategory = _service.GetCategory(categoryId);

        savedCategory.ShouldNotBe(null);
        savedCategory.Name.ShouldBe("Camisetas");
        savedCategory.Description.ShouldBe("Camisetas de algodão");
    }
    
    [Fact]
    public void Should_Get_Categories()
    {
        //Arrange
        var dto1 = new CreateCategoryDTO()
        {
            Name = "Camisetas",
            Description = "Camisetas de algodão",
        };
        
        var dto2 = new CreateCategoryDTO()
        {
            Name = "Calças",
            Description = "Calças jeans",
        };

        var category1Id = _service.CreateCategory(dto1);
        var category2Id = _service.CreateCategory(dto2);

        //Act
        var savedCategories = _service.GetCategories(null,0,10);

        //Assert
        savedCategories.Items.Count().ShouldBe(2);
        savedCategories.Items.First().Id.ShouldBe(category1Id);
        savedCategories.Items.Where(item=>item.Name == "Calças").ShouldNotBeNull();
        savedCategories.Items.First(item=>item.Name == "Calças").Id.ShouldBe(category2Id);
    }
    
    [Fact]
    public void Should_Update_Category()
    {
        //Arrange
        var dto = new CreateCategoryDTO()
        {
            Name = "Camisetas",
            Description = "Camisetas de algodão",
        };
        
        var categoryId = _service.CreateCategory(dto);
        
        var dtoUpdate = new UpdateCategoriesDTO()
        {
            Id = categoryId,
            Name = "Camisetas de algodão",
            Description = "Nova descrição para a categoria",
        };


        //Act
        var category = _service.UpdateCategory(dtoUpdate);
        
        //Assert
        var categoryChanged = _service.GetCategory(categoryId);
        
        categoryChanged.Name.ShouldBe("Camisetas de algodão");
        categoryChanged.Description.ShouldBe("Nova descrição para a categoria");
    }
    
        
    [Fact]
    public void Should_Delete_Category_By_Id()
    {
        //Arrange
        var dto = new CreateCategoryDTO()
        {
            Name = "Camisetas",
            Description = "Camisetas de algodão",
        };
        
        //Act
        Guid categoryId = _service.CreateCategory(dto);
        Category CategoryDeleted = _service.DeleteCategory(categoryId);
    
        //Assert
        var categories = _service.GetCategories(null,0,10);
        
        categories.ShouldNotBe(null);
    }
    
    [Fact]
    public void Should_Get_Category_With_Products()
    {
        //Arrange
        var category = new Category
        {
            Name = "Roupas",
            Description = "Roupas em geral"
        };

        _context.Categories.Add(category);

        var product = new CORE.Entity.Product
        {
            Name = "Camiseta Azul",
            Description = "Tecido algodão",
            Price = 59.90m,
            ImageUrl = "https://teste.com/img.png",
            Stock = 10,
            CategoryId = category.Id
        };

        _context.Products.Add(product);
        _context.SaveChanges();

        //Act
        var result = _service.GetCategory(category.Id);

        //Assert
        result.ShouldNotBeNull();
        result.Name.ShouldBe("Roupas");
        result.Description.ShouldBe("Roupas em geral");

        result.Products.ShouldNotBeEmpty();
        result.Products.Count.ShouldBe(1);

        var savedProduct = result.Products.First();
        savedProduct.Name.ShouldBe("Camiseta Azul");
        savedProduct.Price.ShouldBe(59.90m);
    }
    
    [Fact]
    public void Should_Update_Category_With_Products()
    {
        //Arrange
        var category = new Category
        {
            Name = "Roupas",
            Description = "Roupas diversas"
        };

        _context.Categories.Add(category);

        var product = new CORE.Entity.Product
        {
            Name = "Camiseta Vermelha",
            Description = "Algodão",
            Price = 49.90m,
            ImageUrl = "img.png",
            Stock = 5,
            CategoryId = category.Id
        };

        _context.Products.Add(product);
        _context.SaveChanges();

        var updateDto = new UpdateCategoriesDTO()
        {
            Id = category.Id,
            Name = "Roupas Masculinas",
            Description = "Atualizado - roupas masculinas em geral"
        };

        //Act
        _service.UpdateCategory(updateDto);

        //Assert
        var updatedCategory = _service.GetCategory(category.Id);

        updatedCategory.ShouldNotBeNull();
        updatedCategory.Name.ShouldBe("Roupas Masculinas");
        updatedCategory.Description.ShouldBe("Atualizado - roupas masculinas em geral");

        updatedCategory.Products.ShouldNotBeEmpty();
        updatedCategory.Products.Count.ShouldBe(1);

        var savedProduct = updatedCategory.Products.First();
        savedProduct.Name.ShouldBe("Camiseta Vermelha");
        savedProduct.Stock.ShouldBe(5);
    }

}