import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrugService } from '../../services/drug.service';
import { AuthService } from '../../services/auth.service';
import { Drug, CreateDrug } from '../../models/drug.model';

@Component({
  selector: 'app-drugs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Drug Master List</h2>
        <button *ngIf="auth.isAdmin()" class="btn-primary" (click)="openModal()">+ Add Drug</button>
      </div>
      <div class="search-bar">
        <input [(ngModel)]="search" placeholder="Search drugs..." (input)="filterDrugs()" />
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Unit</th><th>Threshold</th><th>Total Stock</th><th>Status</th><th *ngIf="auth.isAdmin()">Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let drug of filtered">
              <td><strong>{{ drug.name }}</strong></td>
              <td>{{ drug.category || '—' }}</td>
              <td>{{ drug.unit || '—' }}</td>
              <td>{{ drug.lowStockThreshold }}</td>
              <td>{{ drug.totalStock }}</td>
              <td><span class="badge" [class.low]="drug.totalStock < drug.lowStockThreshold">{{ drug.totalStock < drug.lowStockThreshold ? 'Low Stock' : 'OK' }}</span></td>
              <td *ngIf="auth.isAdmin()">
                <button class="btn-sm" (click)="openModal(drug)">Edit</button>
                <button class="btn-sm danger" (click)="deleteDrug(drug.drugId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editing ? 'Edit Drug' : 'Add Drug' }}</h3>
          <div class="form-group"><label>Name *</label><input [(ngModel)]="form.name" /></div>
          <div class="form-group"><label>Category</label><input [(ngModel)]="form.category" /></div>
          <div class="form-group"><label>Unit</label><input [(ngModel)]="form.unit" placeholder="tablets / mg / ml" /></div>
          <div class="form-group"><label>Description</label><input [(ngModel)]="form.description" /></div>
          <div class="form-group"><label>Low Stock Threshold</label><input type="number" [(ngModel)]="form.lowStockThreshold" /></div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn-primary" (click)="save()">{{ editing ? 'Update' : 'Add' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .page-title { font-size:22px; font-weight:700; color:#1e293b; }
    .search-bar { margin-bottom:16px; }
    .search-bar input { padding:10px 14px; border:1px solid #e2e8f0; border-radius:8px; width:300px; font-size:14px; }
    .table-wrapper { overflow-x:auto; background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; }
    td { padding:12px 16px; font-size:14px; border-bottom:1px solid #f1f5f9; }
    .badge { padding:3px 10px; border-radius:20px; font-size:12px; background:#dcfce7; color:#166534; font-weight:600; }
    .badge.low { background:#fee2e2; color:#991b1b; }
    .btn-primary { background:#4f8ef7; color:#fff; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-secondary { background:#f1f5f9; color:#334155; border:none; padding:9px 18px; border-radius:8px; cursor:pointer; }
    .btn-sm { padding:4px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#fff; cursor:pointer; font-size:13px; margin-right:4px; }
    .btn-sm.danger { color:#dc2626; border-color:#fecaca; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
    .modal { background:#fff; border-radius:12px; padding:32px; width:420px; }
    .modal h3 { margin:0 0 20px; font-size:18px; }
    .form-group { margin-bottom:14px; }
    .form-group label { display:block; font-size:13px; color:#64748b; margin-bottom:4px; }
    .form-group input { width:100%; padding:9px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
  `]
})
export class DrugsComponent implements OnInit {
  drugs: Drug[] = []; filtered: Drug[] = [];
  search = ''; showModal = false; editing: Drug | null = null;
  form: CreateDrug = { name: '', lowStockThreshold: 10 };

  constructor(public auth: AuthService, private drugService: DrugService) {}
  ngOnInit() { this.load(); }
  load() { this.drugService.getAll().subscribe(d => { this.drugs = d; this.filtered = d; }); }
  filterDrugs() { this.filtered = this.drugs.filter(d => d.name.toLowerCase().includes(this.search.toLowerCase())); }
  openModal(drug?: Drug) {
    this.editing = drug || null;
    this.form = drug ? { name: drug.name, category: drug.category, unit: drug.unit, description: drug.description, lowStockThreshold: drug.lowStockThreshold } : { name: '', lowStockThreshold: 10 };
    this.showModal = true;
  }
  closeModal() { this.showModal = false; }
  save() {
    const obs = this.editing ? this.drugService.update(this.editing.drugId, this.form) : this.drugService.create(this.form);
    obs.subscribe(() => { this.load(); this.closeModal(); });
  }
  deleteDrug(id: number) {
    if (confirm('Delete this drug?')) this.drugService.delete(id).subscribe(() => this.load());
  }
}