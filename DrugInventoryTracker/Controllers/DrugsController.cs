using DrugInventoryTracker.Data;
using DrugInventoryTracker.DTOs;
using DrugInventoryTracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrugInventoryTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DrugsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DrugsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var drugs = await _db.Drugs
                .Where(d => d.IsActive)
                .Select(d => new DrugDto
                {
                    DrugId = d.DrugId,
                    Name = d.Name,
                    Category = d.Category,
                    Unit = d.Unit,
                    Description = d.Description,
                    LowStockThreshold = d.LowStockThreshold,
                    TotalStock = d.Inventories.Sum(i => i.Quantity)
                }).ToListAsync();
            return Ok(drugs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var drug = await _db.Drugs
                .Include(d => d.Inventories)
                .FirstOrDefaultAsync(d => d.DrugId == id && d.IsActive);
            if (drug == null) return NotFound();
            return Ok(drug);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateDrugDto dto)
        {
            var drug = new Drug
            {
                Name = dto.Name,
                Category = dto.Category,
                Unit = dto.Unit,
                Description = dto.Description,
                LowStockThreshold = dto.LowStockThreshold
            };
            _db.Drugs.Add(drug);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = drug.DrugId }, drug);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateDrugDto dto)
        {
            var drug = await _db.Drugs.FindAsync(id);
            if (drug == null) return NotFound();
            drug.Name = dto.Name;
            drug.Category = dto.Category;
            drug.Unit = dto.Unit;
            drug.Description = dto.Description;
            drug.LowStockThreshold = dto.LowStockThreshold;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var drug = await _db.Drugs.FindAsync(id);
            if (drug == null) return NotFound();
            drug.IsActive = false; // soft delete
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}