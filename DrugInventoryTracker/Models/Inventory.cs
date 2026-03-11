namespace DrugInventoryTracker.Models
{
    public class Inventory
    {
        public int InventoryId { get; set; }
        public int DrugId { get; set; }
        public int? SupplierId { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; } = 0;
        public DateOnly ExpiryDate { get; set; }
        public DateOnly ReceivedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
        public decimal? UnitPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Drug Drug { get; set; } = null!;
        public Supplier? Supplier { get; set; }
        public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}