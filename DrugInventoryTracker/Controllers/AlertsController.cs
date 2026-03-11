using DrugInventoryTracker.Data;
using DrugInventoryTracker.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrugInventoryTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlertsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AlertsController(AppDbContext db) => _db = db;

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var soonDate = DateOnly.FromDateTime(DateTime.Today.AddDays(30));

            var drugs = await _db.Drugs.Include(d => d.Inventories).Where(d => d.IsActive).ToListAsync();

            return Ok(new DashboardSummaryDto
            {
                TotalDrugs = drugs.Count,
                TotalBatches = await _db.Inventories.CountAsync(),
                LowStockCount = drugs.Count(d => d.Inventories.Sum(i => i.Quantity) < d.LowStockThreshold),
                ExpiringSoonCount = await _db.Inventories.CountAsync(i => i.ExpiryDate > today && i.ExpiryDate <= soonDate),
                ExpiredCount = await _db.Inventories.CountAsync(i => i.ExpiryDate < today)
            });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var alerts = await _db.Drugs
                .Where(d => d.IsActive)
                .Include(d => d.Inventories)
                .Where(d => d.Inventories.Sum(i => i.Quantity) < d.LowStockThreshold)
                .Select(d => new LowStockAlertDto
                {
                    DrugId = d.DrugId,
                    DrugName = d.Name,
                    Category = d.Category,
                    TotalStock = d.Inventories.Sum(i => i.Quantity),
                    Threshold = d.LowStockThreshold
                }).ToListAsync();
            return Ok(alerts);
        }

        [HttpGet("expiring-soon")]
        public async Task<IActionResult> GetExpiringSoon()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var soonDate = DateOnly.FromDateTime(DateTime.Today.AddDays(30));

            var alerts = await _db.Inventories
                .Include(i => i.Drug)
                .Where(i => i.ExpiryDate <= soonDate && i.Quantity > 0)
                .OrderBy(i => i.ExpiryDate)
                .Select(i => new ExpiryAlertDto
                {
                    InventoryId = i.InventoryId,
                    DrugName = i.Drug.Name,
                    BatchNumber = i.BatchNumber,
                    Quantity = i.Quantity,
                    ExpiryDate = i.ExpiryDate,
                    DaysUntilExpiry = (int)(i.ExpiryDate.ToDateTime(TimeOnly.MinValue) - DateTime.Today).TotalDays
                }).ToListAsync();
            return Ok(alerts);
        }
    }
}

