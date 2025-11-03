using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ECOMMERCE.DATA.Data
{
    public class EcommerceDbContextFactory : IDesignTimeDbContextFactory<EcommerceDbContext>
    {
        public EcommerceDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<EcommerceDbContext>();

            // Coloque aqui a sua string de conexão
            string mysqlString = "server=localhost; port=8889; database=ecommerce_api;user=root;password=NapaTheBest@290306$;Persist Security Info=False; Convert Zero DateTime=True";

            optionsBuilder.UseMySql(mysqlString, ServerVersion.AutoDetect(mysqlString));

            return new EcommerceDbContext(optionsBuilder.Options);
        }
    }
}