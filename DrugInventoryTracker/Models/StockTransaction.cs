namespace DrugInventoryTracker.Models
{
    public class StockTransaction
    {
        public int TransactionId { get; set; }
        public int InventoryId { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; } = string.Empty; // IN / OUT
        public int Quantity { get; set; }
        public string? Reason { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

        public Inventory Inventory { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
