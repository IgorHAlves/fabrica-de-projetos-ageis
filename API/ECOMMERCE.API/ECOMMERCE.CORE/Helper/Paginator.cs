namespace ECOMMERCE.CORE.Helper;

public class Paginator<TEntity>
{
    public virtual IList<TEntity> Items { get; set; }
    public int Total { get; set; }
    
}