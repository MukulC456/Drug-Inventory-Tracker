import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { DashboardSummary } from '../../models/alert.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <h2 class="page-title">Dashboard</h2>
      <div *ngIf="summary" class="cards-grid">
        <div class="card blue">
          <div class="card-icon">💊</div>
          <div class="card-info">
            <div class="card-value">{{ summary.totalDrugs }}</div>
            <div class="card-label">Total Drugs</div>
          </div>
        </div>
        <div class="card teal">
          <div class="card-icon">📦</div>
          <div class="card-info">
            <div class="card-value">{{ summary.totalBatches }}</div>
            <div class="card-label">Total Batches</div>
          </div>
        </div>
        <div class="card orange" [routerLink]="['/alerts']">
          <div class="card-icon">⚠️</div>
          <div class="card-info">
            <div class="card-value">{{ summary.lowStockCount }}</div>
            <div class="card-label">Low Stock</div>
          </div>
        </div>
        <div class="card yellow" [routerLink]="['/alerts']">
          <div class="card-icon">🕐</div>
          <div class="card-info">
            <div class="card-value">{{ summary.expiringSoonCount }}</div>
            <div class="card-label">Expiring Soon</div>
          </div>
        </div>
        <div class="card red" [routerLink]="['/alerts']">
          <div class="card-icon">❌</div>
          <div class="card-info">
            <div class="card-value">{{ summary.expiredCount }}</div>
            <div class="card-label">Expired Batches</div>
          </div>
        </div>
      </div>
      <div *ngIf="!summary" class="loading">Loading summary...</div>
    </div>
  `,
  styles: [`
    .page { padding:24px; }
    .page-title { font-size:22px; font-weight:700; margin-bottom:24px; color:#1e293b; }
    .cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
    .card { display:flex; align-items:center; gap:16px; padding:24px; border-radius:12px; cursor:pointer; color:#fff; transition:transform 0.2s; }
    .card:hover { transform:translateY(-2px); }
    .card-icon { font-size:36px; }
    .card-value { font-size:32px; font-weight:700; }
    .card-label { font-size:13px; opacity:0.85; }
    .blue   { background:linear-gradient(135deg,#4f8ef7,#2563eb); }
    .teal   { background:linear-gradient(135deg,#22d3a5,#0891b2); }
    .orange { background:linear-gradient(135deg,#fb923c,#ea580c); }
    .yellow { background:linear-gradient(135deg,#fbbf24,#d97706); }
    .red    { background:linear-gradient(135deg,#f87171,#dc2626); }
    .loading { color:#64748b; }
  `]
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;
  constructor(private alertService: AlertService) {}
  ngOnInit() {
    this.alertService.getDashboard().subscribe(s => this.summary = s);
  }
}