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
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public SuppliersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _db.Suppliers.ToListAsync());

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactEmail = dto.ContactEmail,
                Phone = dto.Phone,
                Address = dto.Address
            };
            _db.Suppliers.Add(supplier);
            await _db.SaveChangesAsync();
            return Ok(supplier);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateSupplierDto dto)
        {
            var supplier = await _db.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();
            supplier.Name = dto.Name;
            supplier.ContactEmail = dto.ContactEmail;
            supplier.Phone = dto.Phone;
            supplier.Address = dto.Address;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}