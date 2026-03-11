namespace DrugInventoryTracker.DTOs
{
    public class DrugDto
    {
        public int DrugId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Unit { get; set; }
        public string? Description { get; set; }
        public int LowStockThreshold { get; set; }
        public int TotalStock { get; set; }   // computed: sum of inventory quantities
    }

    public class CreateDrugDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Unit { get; set; }
        public string? Description { get; set; }
        public int LowStockThreshold { get; set; } = 10;
    }
}
