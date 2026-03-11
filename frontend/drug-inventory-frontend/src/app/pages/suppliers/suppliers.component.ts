import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../services/auth.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Suppliers</h2>
        <button *ngIf="auth.isAdmin()" class="btn-primary" (click)="openModal()">+ Add Supplier</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th *ngIf="auth.isAdmin()">Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of suppliers">
              <td><strong>{{ s.name }}</strong></td>
              <td>{{ s.contactEmail || '—' }}</td>
              <td>{{ s.phone || '—' }}</td>
              <td>{{ s.address || '—' }}</td>
              <td *ngIf="auth.isAdmin()"><button class="btn-sm" (click)="openModal(s)">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editing ? 'Edit' : 'Add' }} Supplier</h3>
          <div class="form-group"><label>Name *</label><input [(ngModel)]="form.name" /></div>
          <div class="form-group"><label>Email</label><input [(ngModel)]="form.contactEmail" /></div>
          <div class="form-group"><label>Phone</label><input [(ngModel)]="form.phone" /></div>
          <div class="form-group"><label>Address</label><input [(ngModel)]="form.address" /></div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showModal=false">Cancel</button>
            <button class="btn-primary" (click)="save()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .page-title { font-size:22px; font-weight:700; color:#1e293b; }
    .table-wrapper { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.08); overflow:hidden; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; font-size:14px; border-bottom:1px solid #f1f5f9; }
    .btn-primary { background:#4f8ef7; color:#fff; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-secondary { background:#f1f5f9; color:#334155; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; }
    .btn-sm { padding:4px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#fff; cursor:pointer; font-size:13px; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
    .modal { background:#fff; border-radius:12px; padding:32px; width:420px; }
    .modal h3 { margin:0 0 20px; }
    .form-group { margin-bottom:14px; }
    .form-group label { display:block; font-size:13px; color:#64748b; margin-bottom:4px; }
    .form-group input { width:100%; padding:9px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = []; showModal = false; editing: Supplier | null = null;
  form: any = { name: '' };
  constructor(public auth: AuthService, private supplierService: SupplierService) {}
  ngOnInit() { this.supplierService.getAll().subscribe(s => this.suppliers = s); }
  openModal(s?: Supplier) { this.editing = s || null; this.form = s ? { ...s } : { name: '' }; this.showModal = true; }
  save() {
    const obs = this.editing ? this.supplierService.update(this.editing.supplierId, this.form) : this.supplierService.create(this.form);
    obs.subscribe(() => { this.supplierService.getAll().subscribe(s => this.suppliers = s); this.showModal = false; });
  }
}