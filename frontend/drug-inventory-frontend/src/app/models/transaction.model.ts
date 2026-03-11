export interface Transaction {
  transactionId: number;
  drugName: string;
  batchNumber: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason?: string;
  transactionDate: string;
  performedBy: string;
}