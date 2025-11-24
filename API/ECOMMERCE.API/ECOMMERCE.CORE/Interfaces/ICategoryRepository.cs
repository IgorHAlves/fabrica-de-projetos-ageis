using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.DATA.Interfaces
{
    public interface ICategoryRepository 
    {
        public Category CreateCategory(Category category);
        public Category GetCategory(Guid id);
        public Paginator<Category> GetCategories(string? name, int pageNumber, int pageSize);
        public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO updateCatrgoriesDTO);
        public void DeleteCategory(Guid id);
    }
}