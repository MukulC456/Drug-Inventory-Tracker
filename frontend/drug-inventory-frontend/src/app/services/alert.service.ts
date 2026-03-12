import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardSummary, LowStockAlert, ExpiryAlert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private url = 'https://localhost:7000/api/alerts';

  constructor(private http: HttpClient) {}

  getDashboard() { return this.http.get<DashboardSummary>(`${this.url}/dashboard`); }
  getLowStock() { return this.http.get<LowStockAlert[]>(`${this.url}/low-stock`); }
  getExpiringSoon() { return this.http.get<ExpiryAlert[]>(`${this.url}/expiring-soon`); }
}