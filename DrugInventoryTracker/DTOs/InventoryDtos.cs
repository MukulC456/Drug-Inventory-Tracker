namespace DrugInventoryTracker.DTOs
{
    public class InventoryDto
    {
        public int InventoryId { get; set; }
        public int DrugId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public string? SupplierName { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public DateOnly ReceivedDate { get; set; }
        public decimal? UnitPrice { get; set; }
        public bool IsExpired => ExpiryDate < DateOnly.FromDateTime(DateTime.Today);
        public bool IsExpiringSoon => ExpiryDate <= DateOnly.FromDateTime(DateTime.Today.AddDays(30)) && !IsExpired;
    }

    public class AddStockDto
    {
        public int DrugId { get; set; }
        public int? SupplierId { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public DateOnly ReceivedDate { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? Reason { get; set; }
    }

    public class RemoveStockDto
    {
        public int InventoryId { get; set; }
        public int Quantity { get; set; }
        public string? Reason { get; set; }
    }
}