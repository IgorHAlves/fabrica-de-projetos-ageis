using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.DATA.Data;
using Microsoft.EntityFrameworkCore;

namespace ECOMMERCE.API.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly EcommerceDbContext _context;

    public OrderRepository(EcommerceDbContext context)
    {
        _context = context;
    }

    public Paginator<Order> GetOrders(int pageNumber, int pageSize)
    {
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        
        var query =  _context.Orders;
            
        var list = query.Include(order => order.OrderItems)
            .ThenInclude(orderItem => orderItem.Product)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var totalItens  = query.Count();
        
        var totalPages = (int)Math.Ceiling((double)totalItens / pageSize);
        
        return new Paginator<Order>()
        {
            ActualPage =  pageNumber,
            TotalItens = totalItens,
            Items = list,
            TotalPages = totalPages
        };
    }

    public Order GetOrder(Guid id)
    {
        return _context.Orders
            .Include(order => order.OrderItems)
            .ThenInclude(orderItem => orderItem.Product)
            .FirstOrDefault(order => order.Id == id);
        
    }

    public Order CreateOrder(Order order)
    {
        _context.Add(order);
        _context.SaveChanges();
        return order;
    }
}