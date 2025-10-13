using ECOMMERCE.API.Entity;
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
    public DbSet<Order> Orders { get; set; }
    public DbSet<Category> Categories { get; set; }
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
        
        //Categories
        modelBuilder.Entity<Category>()
            .HasKey(category => category.Id );

        modelBuilder.Entity<Category>()
            .HasMany(category => category.Products)
            .WithOne(product => product.Category)
            .HasForeignKey(product => product.CategoryId );
        //User
        modelBuilder.Entity<User>().HasKey(user => user.Id );

        modelBuilder.Entity<User>()
            .HasOne(user => user.Address)
            .WithMany()
            .HasForeignKey(user => user.AddressId);

        modelBuilder.Entity<User>()
            .HasMany<Sale>()
            .WithOne()
            .HasForeignKey(sale => sale.UserId);
        
        //Order
        
        modelBuilder.Entity<Order>()
            .HasKey(order => order.Id );

        modelBuilder.Entity<Order>()
            .HasOne(order => order.User)
            .WithMany(user => user.Orders)
            .HasForeignKey(order => order.UserId);
        
        modelBuilder.Entity<Order>()
            .HasMany(order => order.OrderItems)
            .WithOne(orderItem => orderItem.Order)
            .HasForeignKey(orderItem => orderItem.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(orderItem => orderItem.Product)
            .WithMany()
            .HasForeignKey(orderItem => orderItem.ProductId);
    }
      
}