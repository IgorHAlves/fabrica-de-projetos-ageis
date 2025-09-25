using ECOMMERCE.CORE.Entity;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.DATA.Data;

public partial class EcommerceDbContext : DbContext
{
    public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options)
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
            .HasOne(u => u.Address)
            .WithMany()
            .HasForeignKey(user => user.AddressId);

        modelBuilder.Entity<User>()
            .HasMany<Sale>()
            .WithOne()
            .HasForeignKey(sale => sale.UserId);
    }
      
}