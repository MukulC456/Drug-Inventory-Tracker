export interface Drug {
  drugId: number;
  name: string;
  category?: string;
  unit?: string;
  description?: string;
  lowStockThreshold: number;
  totalStock: number;
}

export interface CreateDrug {
  name: string;
  category?: string;
  unit?: string;
  description?: string;
  lowStockThreshold: number;
}