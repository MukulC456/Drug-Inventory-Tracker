using System.ComponentModel.DataAnnotations;

namespace DrugInventoryTracker.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Pharmacist";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}