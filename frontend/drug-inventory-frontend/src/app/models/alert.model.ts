export interface DashboardSummary {
  totalDrugs: number;
  totalBatches: number;
  lowStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
}

export interface LowStockAlert {
  drugId: number;
  drugName: string;
  category?: string;
  totalStock: number;
  threshold: number;
}

export interface ExpiryAlert {
  inventoryId: number;
  drugName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
}