export interface Inventory {
  inventoryId: number;
  drugId: number;
  drugName: string;
  supplierName?: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
  unitPrice?: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface AddStock {
  drugId: number;
  supplierId?: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
  unitPrice?: number;
  reason?: string;
}

export interface RemoveStock {
  inventoryId: number;
  quantity: number;
  reason?: string;
}