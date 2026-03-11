using DrugInventoryTracker.Data;
using DrugInventoryTracker.DTOs;
using DrugInventoryTracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DrugInventoryTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InventoryController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventory = await _db.Inventories
                .Include(i => i.Drug)
                .Include(i => i.Supplier)
                .Select(i => new InventoryDto
                {
                    InventoryId = i.InventoryId,
                    DrugId = i.DrugId,
                    DrugName = i.Drug.Name,
                    SupplierName = i.Supplier != null ? i.Supplier.Name : null,
                    BatchNumber = i.BatchNumber,
                    Quantity = i.Quantity,
                    ExpiryDate = i.ExpiryDate,
                    ReceivedDate = i.ReceivedDate,
                    UnitPrice = i.UnitPrice
                }).ToListAsync();
            return Ok(inventory);
        }

        [HttpPost("add-stock")]
        public async Task<IActionResult> AddStock(AddStockDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var inventory = new Inventory
            {
                DrugId = dto.DrugId,
                SupplierId = dto.SupplierId,
                BatchNumber = dto.BatchNumber,
                Quantity = dto.Quantity,
                ExpiryDate = dto.ExpiryDate,
                ReceivedDate = dto.ReceivedDate,
                UnitPrice = dto.UnitPrice
            };
            _db.Inventories.Add(inventory);
            await _db.SaveChangesAsync();

            // Log the transaction
            _db.StockTransactions.Add(new StockTransaction
            {
                InventoryId = inventory.InventoryId,
                UserId = userId,
                Type = "IN",
                Quantity = dto.Quantity,
                Reason = dto.Reason ?? "Stock received"
            });
            await _db.SaveChangesAsync();

            return Ok(inventory);
        }

        [HttpPost("remove-stock")]
        public async Task<IActionResult> RemoveStock(RemoveStockDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var inventory = await _db.Inventories.FindAsync(dto.InventoryId);

            if (inventory == null) return NotFound("Inventory batch not found.");
            if (inventory.Quantity < dto.Quantity)
                return BadRequest($"Insufficient stock. Available: {inventory.Quantity}");

            inventory.Quantity -= dto.Quantity;

            _db.StockTransactions.Add(new StockTransaction
            {
                InventoryId = dto.InventoryId,
                UserId = userId,
                Type = "OUT",
                Quantity = dto.Quantity,
                Reason = dto.Reason ?? "Stock dispensed"
            });
            await _db.SaveChangesAsync();
            return Ok(inventory);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions()
        {
            var txns = await _db.StockTransactions
                .Include(t => t.Inventory).ThenInclude(i => i.Drug)
                .Include(t => t.User)
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new {
                    t.TransactionId,
                    DrugName = t.Inventory.Drug.Name,
                    t.Inventory.BatchNumber,
                    t.Type,
                    t.Quantity,
                    t.Reason,
                    t.TransactionDate,
                    PerformedBy = t.User.Username
                }).ToListAsync();
            return Ok(txns);
        }
    }
}