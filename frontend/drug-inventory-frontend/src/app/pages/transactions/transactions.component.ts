import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h2 class="page-title">Stock Transaction Log</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Date</th><th>Drug</th><th>Batch</th><th>Type</th><th>Quantity</th><th>Reason</th><th>Performed By</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transactions">
              <td>{{ t.transactionDate | date:'dd MMM yyyy, HH:mm' }}</td>
              <td><strong>{{ t.drugName }}</strong></td>
              <td>{{ t.batchNumber }}</td>
              <td><span class="badge" [class.in]="t.type === 'IN'" [class.out]="t.type === 'OUT'">{{ t.type }}</span></td>
              <td>{{ t.quantity }}</td>
              <td>{{ t.reason || '—' }}</td>
              <td>{{ t.performedBy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-title { font-size:22px; font-weight:700; color:#1e293b; margin-bottom:16px; }
    .table-wrapper { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.08); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; font-size:14px; border-bottom:1px solid #f1f5f9; }
    .badge { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
    .badge.in  { background:#dcfce7; color:#166534; }
    .badge.out { background:#fee2e2; color:#991b1b; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  constructor(private inventoryService: InventoryService) {}
  ngOnInit() { this.inventoryService.getTransactions().subscribe(t => this.transactions = t); }
}
