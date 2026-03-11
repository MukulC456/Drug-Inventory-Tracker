namespace DrugInventoryTracker.DTOs
{
    public class LowStockAlertDto
    {
        public int DrugId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int TotalStock { get; set; }
        public int Threshold { get; set; }
    }

    public class ExpiryAlertDto
    {
        public int InventoryId { get; set; }
        public string DrugName { get; set; } = string.Empty;
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int DaysUntilExpiry { get; set; }
    }

    public class DashboardSummaryDto
    {
        public int TotalDrugs { get; set; }
        public int TotalBatches { get; set; }
        public int LowStockCount { get; set; }
        public int ExpiringSoonCount { get; set; }
        public int ExpiredCount { get; set; }
    }
}