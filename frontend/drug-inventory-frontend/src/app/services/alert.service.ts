import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardSummary, LowStockAlert, ExpiryAlert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private url = 'https://drug-inventory-api-mukul-a5d0e9b9fhbjbpdd.southindia-01.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getDashboard() { return this.http.get<DashboardSummary>(`${this.url}/dashboard`); }
  getLowStock() { return this.http.get<LowStockAlert[]>(`${this.url}/low-stock`); }
  getExpiringSoon() { return this.http.get<ExpiryAlert[]>(`${this.url}/expiring-soon`); }
}