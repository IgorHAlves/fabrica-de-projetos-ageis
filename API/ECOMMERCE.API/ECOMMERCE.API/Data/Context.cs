using ECOMMERCE.API.Entity;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.API.Data;

public partial class Context : DbContext
{
    public Context(DbContextOptions<Context> options) : base(options)
    {
            
    }
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        //Product
        modelBuilder.Entity<Product>()
            .HasKey(product => product.Id );
            
        modelBuilder.Entity<Product>()
            .HasOne<Product>()
            .WithMany()
            .HasForeignKey(product => product.IdPai )
            .OnDelete(DeleteBehavior.Restrict);
        
        //User
        modelBuilder.Entity<User>().HasKey(user => user.Id );

        modelBuilder.Entity<User>()
            .HasOne<Address>();

        modelBuilder.Entity<User>()
            .HasMany<Sale>()
            .WithOne()
            .HasForeignKey(sale => sale.UserId);
    }
      
}