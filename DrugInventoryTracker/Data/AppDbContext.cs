// Data/AppDbContext.cs
using DrugInventoryTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace DrugInventoryTracker.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Drug> Drugs => Set<Drug>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<Inventory> Inventories => Set<Inventory>();
        public DbSet<StockTransaction> StockTransactions => Set<StockTransaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User
            modelBuilder.Entity<User>(e => {
                e.HasKey(u => u.UserId);
                e.HasIndex(u => u.Username).IsUnique();
                e.HasIndex(u => u.Email).IsUnique();
            });

            // Drug
            modelBuilder.Entity<Drug>(e => {
                e.HasKey(d => d.DrugId);
            });

            // Supplier
            modelBuilder.Entity<Supplier>(e => {
                e.HasKey(s => s.SupplierId);
            });

            // Inventory
            modelBuilder.Entity<Inventory>(e => {
                e.HasKey(i => i.InventoryId);
                e.HasOne(i => i.Drug)
                 .WithMany(d => d.Inventories)
                 .HasForeignKey(i => i.DrugId);
                e.HasOne(i => i.Supplier)
                 .WithMany(s => s.Inventories)
                 .HasForeignKey(i => i.SupplierId)
                 .IsRequired(false);
                e.Property(i => i.UnitPrice).HasColumnType("decimal(10,2)");
            });

            // StockTransaction
            modelBuilder.Entity<StockTransaction>(e => {
                e.HasKey(t => t.TransactionId);
                e.HasOne(t => t.Inventory)
                 .WithMany(i => i.StockTransactions)
                 .HasForeignKey(t => t.InventoryId);
                e.HasOne(t => t.User)
                 .WithMany(u => u.StockTransactions)
                 .HasForeignKey(t => t.UserId);
            });
        }
    }
}