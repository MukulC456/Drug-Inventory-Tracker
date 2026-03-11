import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { LowStockAlert, ExpiryAlert } from '../../models/alert.model';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h2 class="page-title">Alerts</h2>
      <div class="tabs">
        <button [class.active]="activeTab === 'low'" (click)="activeTab='low'">⚠️ Low Stock ({{ lowStock.length }})</button>
        <button [class.active]="activeTab === 'expiry'" (click)="activeTab='expiry'">🕐 Expiring / Expired ({{ expiry.length }})</button>
      </div>
      <div *ngIf="activeTab === 'low'" class="table-wrapper">
        <div *ngIf="lowStock.length === 0" class="empty">✅ No low stock alerts!</div>
        <table *ngIf="lowStock.length > 0">
          <thead><tr><th>Drug</th><th>Category</th><th>Current Stock</th><th>Threshold</th><th>Shortage</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of lowStock" class="alert-row-orange">
              <td><strong>{{ a.drugName }}</strong></td>
              <td>{{ a.category || '—' }}</td>
              <td><span class="stock-num">{{ a.totalStock }}</span></td>
              <td>{{ a.threshold }}</td>
              <td class="shortage">-{{ a.threshold - a.totalStock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="activeTab === 'expiry'" class="table-wrapper">
        <div *ngIf="expiry.length === 0" class="empty">✅ No expiry alerts!</div>
        <table *ngIf="expiry.length > 0">
          <thead><tr><th>Drug</th><th>Batch</th><th>Quantity</th><th>Expiry Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of expiry" [class.alert-row-red]="a.daysUntilExpiry < 0" [class.alert-row-yellow]="a.daysUntilExpiry >= 0">
              <td><strong>{{ a.drugName }}</strong></td>
              <td>{{ a.batchNumber }}</td>
              <td>{{ a.quantity }}</td>
              <td>{{ a.expiryDate | date:'dd MMM yyyy' }}</td>
              <td>
                <span class="badge expired"  *ngIf="a.daysUntilExpiry < 0">Expired {{ -a.daysUntilExpiry }} days ago</span>
                <span class="badge expiring" *ngIf="a.daysUntilExpiry >= 0">Expires in {{ a.daysUntilExpiry }} days</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-title { font-size:22px; font-weight:700; color:#1e293b; margin-bottom:16px; }
    .tabs { display:flex; gap:8px; margin-bottom:20px; }
    .tabs button { padding:10px 20px; border:1px solid #e2e8f0; background:#fff; border-radius:8px; cursor:pointer; font-size:14px; }
    .tabs button.active { background:#4f8ef7; color:#fff; border-color:#4f8ef7; font-weight:600; }
    .table-wrapper { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.08); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; font-size:14px; border-bottom:1px solid #f1f5f9; }
    .alert-row-orange { background:#fff7ed; }
    .alert-row-red    { background:#fff5f5; }
    .alert-row-yellow { background:#fefce8; }
    .stock-num { color:#dc2626; font-weight:700; font-size:16px; }
    .shortage { color:#dc2626; font-weight:700; }
    .badge { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge.expired  { background:#fee2e2; color:#991b1b; }
    .badge.expiring { background:#fef9c3; color:#854d0e; }
    .empty { padding:32px; text-align:center; color:#64748b; }
  `]
})
export class AlertsComponent implements OnInit {
  activeTab: 'low' | 'expiry' = 'low';
  lowStock: LowStockAlert[] = []; expiry: ExpiryAlert[] = [];
  constructor(private alertService: AlertService) {}
  ngOnInit() {
    this.alertService.getLowStock().subscribe(a => this.lowStock = a);
    this.alertService.getExpiringSoon().subscribe(a => this.expiry = a);
  }
}