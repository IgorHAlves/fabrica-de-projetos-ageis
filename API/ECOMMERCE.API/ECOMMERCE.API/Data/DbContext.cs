using ECOMMERCE.API.Entity;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.API.Data;

public class DbContext
{
    public partial class Context : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }

      
    }
}