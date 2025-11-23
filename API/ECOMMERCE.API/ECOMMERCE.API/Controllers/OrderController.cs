using System.Security.Claims;
using ECOMMERCE.API.Entity;
using ECOMMERCE.API.Interfaces;
using ECOMMERCE.CORE.DTO.Order;
using ECOMMERCE.CORE.Helper;
using ECOMMERCE.CORE.Interfaces;
using Keycloak.Net.Models.Root;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrderController : ControllerBase
{
    
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
        
    }
    
    //[Authorize]
    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            Paginator<GetOrderDTO> orders = _orderService.GetOrders(pageNumber, pageSize);
            
            return Ok(orders);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
    
    //[Authorize]
    [HttpGet("{OrderId:Guid}")]
    public async Task<IActionResult> GetOrder([FromRoute] Guid OrderId)
    {
        GetOrderDTO order = _orderService.GetOrder(OrderId);
        if (OrderId == null)
        {
            return NotFound();
        }
        return Ok(order);
    }

    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO orderDto)
    {
        string keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        
        orderDto.UserKeycloackId = keycloakId;
        
        Guid order = _orderService.CreateOrder(orderDto);
        
        return Ok(order);
    }
    
}