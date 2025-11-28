using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECOMMERCE.CORE.DTO.Category;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.DATA.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly EcommerceDbContext _ecommerceDbContext;
        public CategoryRepository(EcommerceDbContext ecommerceDbContext)
        {
            _ecommerceDbContext = ecommerceDbContext;
        }

        public Category CreateCategory(Category category)
        {
            _ecommerceDbContext.Add(category);
            _ecommerceDbContext.SaveChanges();
            return category;
        }

        public Category GetCategory(Guid id)
        {
            var category = _ecommerceDbContext.Categories.Include(x => x.Products).FirstOrDefault(category => category.Id.Equals(id));
            if (category == null)
            {
                return null;
            }

            return category;
        }

        public Paginator<Category> GetCategories(string? name, int pageNumber, int pageSize)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize; // Garantir que pageSize nunca seja 0
            
            var categories = _ecommerceDbContext.Categories.Include(x => x.Products).AsQueryable();
            
                int totalItens = categories.Count();
            
            List<Category> listCategories = categories
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            int totalPages = totalItens > 0 ? (int)Math.Ceiling((double)totalItens / pageSize) : 0;
             
            return new Paginator<Category>()
            {
                ActualPage =  pageNumber,
                TotalItens = totalItens,
                Items = listCategories,
                TotalPages = totalPages
            };
        }

        public GetCategoriesDTO UpdateCategory(UpdateCategoriesDTO updateDto)
        {
            var category = _ecommerceDbContext.Categories.FirstOrDefault(category => category.Id == updateDto.Id);
            category.Name = updateDto.Name;
            category.Description = updateDto.Description;
            _ecommerceDbContext.SaveChanges();
            return new GetCategoriesDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
            
        }


        public void DeleteCategory(Guid id)
        {
            var deleteCategory = _ecommerceDbContext.Categories.FirstOrDefault(category => category.Id.Equals(id) );
            _ecommerceDbContext.Remove(deleteCategory);
            _ecommerceDbContext.SaveChanges();
        }
    }
}
