using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.DATA.Interfaces
{
    public interface ICategoryRepository 
    {
        public Category CreateCategory(Category category);
        public Category GetCategory(Guid id);
        public List<Category> GetCategories();
        public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO updateCatrgoriesDTO);
        public void DeleteCategory(Guid id);
    }
}