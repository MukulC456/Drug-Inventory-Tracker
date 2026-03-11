import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { DrugService } from '../../services/drug.service';
import { SupplierService } from '../../services/supplier.service';
import { Inventory, AddStock, RemoveStock } from '../../models/inventory.model';
import { Drug } from '../../models/drug.model';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Inventory</h2>
        <div class="btn-group">
          <button class="btn-primary" (click)="openAddModal()">+ Add Stock</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Drug</th><th>Batch</th><th>Supplier</th><th>Quantity</th><th>Expiry Date</th><th>Received</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of inventory" [class.expired-row]="item.isExpired">
              <td><strong>{{ item.drugName }}</strong></td>
              <td>{{ item.batchNumber }}</td>
              <td>{{ item.supplierName || '—' }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.expiryDate | date:'dd MMM yyyy' }}</td>
              <td>{{ item.receivedDate | date:'dd MMM yyyy' }}</td>
              <td>
                <span class="badge expired" *ngIf="item.isExpired">Expired</span>
                <span class="badge expiring" *ngIf="item.isExpiringSoon && !item.isExpired">Expiring Soon</span>
                <span class="badge ok" *ngIf="!item.isExpired && !item.isExpiringSoon">OK</span>
              </td>
              <td>
                <button class="btn-sm danger" (click)="openRemoveModal(item)" [disabled]="item.quantity === 0">Remove Stock</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Stock Modal -->
      <div class="modal-overlay" *ngIf="showAddModal" (click)="showAddModal=false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Add Stock</h3>
          <div class="form-group"><label>Drug *</label>
            <select [(ngModel)]="addForm.drugId"><option value="0" disabled>Select Drug</option>
              <option *ngFor="let d of drugs" [value]="d.drugId">{{ d.name }}</option>
            </select>
          </div>
          <div class="form-group"><label>Supplier</label>
            <select [(ngModel)]="addForm.supplierId"><option [value]="undefined">None</option>
              <option *ngFor="let s of suppliers" [value]="s.supplierId">{{ s.name }}</option>
            </select>
          </div>
          <div class="form-group"><label>Batch Number *</label><input [(ngModel)]="addForm.batchNumber" /></div>
          <div class="form-group"><label>Quantity *</label><input type="number" [(ngModel)]="addForm.quantity" /></div>
          <div class="form-group"><label>Expiry Date *</label><input type="date" [(ngModel)]="addForm.expiryDate" /></div>
          <div class="form-group"><label>Received Date</label><input type="date" [(ngModel)]="addForm.receivedDate" /></div>
          <div class="form-group"><label>Unit Price</label><input type="number" [(ngModel)]="addForm.unitPrice" /></div>
          <div class="form-group"><label>Reason</label><input [(ngModel)]="addForm.reason" placeholder="Stock received" /></div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showAddModal=false">Cancel</button>
            <button class="btn-primary" (click)="addStock()">Add Stock</button>
          </div>
        </div>
      </div>

      <!-- Remove Stock Modal -->
      <div class="modal-overlay" *ngIf="showRemoveModal" (click)="showRemoveModal=false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Remove Stock — {{ selectedItem?.drugName }}</h3>
          <p style="color:#64748b;font-size:14px">Batch: {{ selectedItem?.batchNumber }} | Available: {{ selectedItem?.quantity }}</p>
          <div class="form-group"><label>Quantity to Remove *</label><input type="number" [(ngModel)]="removeForm.quantity" [max]="selectedItem?.quantity" /></div>
          <div class="form-group"><label>Reason</label><input [(ngModel)]="removeForm.reason" placeholder="Stock dispensed" /></div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showRemoveModal=false">Cancel</button>
            <button class="btn-primary" (click)="removeStock()">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .page-title { font-size:22px; font-weight:700; color:#1e293b; }
    .table-wrapper { overflow-x:auto; background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; font-size:14px; border-bottom:1px solid #f1f5f9; }
    .expired-row { background:#fff5f5; }
    .badge { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge.ok       { background:#dcfce7; color:#166534; }
    .badge.expiring { background:#fef9c3; color:#854d0e; }
    .badge.expired  { background:#fee2e2; color:#991b1b; }
    .btn-primary { background:#4f8ef7; color:#fff; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-secondary { background:#f1f5f9; color:#334155; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; }
    .btn-sm { padding:4px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#fff; cursor:pointer; font-size:13px; }
    .btn-sm.danger { color:#dc2626; border-color:#fecaca; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
    .modal { background:#fff; border-radius:12px; padding:32px; width:440px; max-height:90vh; overflow-y:auto; }
    .modal h3 { margin:0 0 16px; }
    .form-group { margin-bottom:14px; }
    .form-group label { display:block; font-size:13px; color:#64748b; margin-bottom:4px; }
    .form-group input, .form-group select { width:100%; padding:9px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
  `]
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = []; drugs: Drug[] = []; suppliers: Supplier[] = [];
  showAddModal = false; showRemoveModal = false; selectedItem: Inventory | null = null;
  addForm: AddStock = { drugId:0, batchNumber:'', quantity:0, expiryDate:'', receivedDate: new Date().toISOString().split('T')[0] };
  removeForm: RemoveStock = { inventoryId:0, quantity:0 };

  constructor(private inventoryService: InventoryService, private drugService: DrugService, private supplierService: SupplierService) {}
  ngOnInit() {
    this.inventoryService.getAll().subscribe(i => this.inventory = i);
    this.drugService.getAll().subscribe(d => this.drugs = d);
    this.supplierService.getAll().subscribe(s => this.suppliers = s);
  }
  openAddModal() { this.addForm = { drugId:0, batchNumber:'', quantity:0, expiryDate:'', receivedDate: new Date().toISOString().split('T')[0] }; this.showAddModal = true; }
  openRemoveModal(item: Inventory) { this.selectedItem = item; this.removeForm = { inventoryId: item.inventoryId, quantity:0 }; this.showRemoveModal = true; }
  addStock() {
    this.inventoryService.addStock(this.addForm).subscribe(() => {
      this.inventoryService.getAll().subscribe(i => this.inventory = i);
      this.showAddModal = false;
    });
  }
  removeStock() {
    this.inventoryService.removeStock(this.removeForm).subscribe(() => {
      this.inventoryService.getAll().subscribe(i => this.inventory = i);
      this.showRemoveModal = false;
    });
  }
}