using ECOMMERCE.API.Entity;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Entity;
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

    public List<Order> GetOrders()
    {
        return _context.Orders
            .Select(order => order)
            .ToList();
    }

    public Order GetOrder(Guid id)
    {
        return _context.Orders.FirstOrDefault(order => order.Id == id);
    }

    public Order CreateOrder(Order order)
    {
        _context.Add(order);
        _context.SaveChanges();
        return order;
    }
}