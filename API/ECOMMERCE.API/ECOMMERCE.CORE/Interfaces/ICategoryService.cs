using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;

namespace ECOMMERCE.CORE.Interfaces
{
    public interface ICategoryService 
    { 
        public Guid CreateCategory(CreateCategoryDTO dto);
        public GetCategoriesDTO GetCategory(Guid id);
        public Paginator<GetCategoriesDTO> GetCategories(string? name, int pageNumber, int pageSize);
        public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO id);
        public Category DeleteCategory(Guid id);
    }
}
