using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;

namespace ECOMMERCE.CORE.Interfaces
{
    public interface ICategoryService 
    { 
        public Category CreateCategory(CreateCategoryDTO dto);
        public GetCategoriesDTO GetCategory(Guid id);
        public List<GetCategoriesDTO> GetCategories();
        public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO id);
        public Category DeleteCategory(Guid id);
    }
}
