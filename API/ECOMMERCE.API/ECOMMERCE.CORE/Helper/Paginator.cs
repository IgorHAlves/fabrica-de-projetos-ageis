namespace ECOMMERCE.CORE.Helper;

public class Paginator<TEntity>
{
    public virtual IList<TEntity> Items { get; set; }
    public int ActualPage { get; set; }
    public int TotalItens { get; set; }
    public int TotalPages { get; set; }
    
}