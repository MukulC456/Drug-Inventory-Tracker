import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory, AddStock, RemoveStock } from '../models/inventory.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private url = 'http://localhost:5287/api/inventory';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Inventory[]>(this.url); }
  addStock(dto: AddStock) { return this.http.post<Inventory>(`${this.url}/add-stock`, dto); }
  removeStock(dto: RemoveStock) { return this.http.post<Inventory>(`${this.url}/remove-stock`, dto); }
  getTransactions() { return this.http.get<Transaction[]>(`${this.url}/transactions`); }
}