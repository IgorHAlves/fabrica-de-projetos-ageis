using ECOMMERCE.DATA.Data;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.TESTS;

public class TestDbContextFactory
{
    public static EcommerceDbContext Create()
    {
        var options = new DbContextOptionsBuilder<EcommerceDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .EnableSensitiveDataLogging()
            .Options;

        return new EcommerceDbContext(options);
    }
}