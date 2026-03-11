namespace DrugInventoryTracker.Models
{
    public class Drug
    {
        public int DrugId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Unit { get; set; }
        public string? Description { get; set; }
        public int LowStockThreshold { get; set; } = 10;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}