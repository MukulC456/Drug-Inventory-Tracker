import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private url = 'https://localhost:7000/api/suppliers';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Supplier[]>(this.url); }
  create(s: any) { return this.http.post<Supplier>(this.url, s); }
  update(id: number, s: any) { return this.http.put(`${this.url}/${id}`, s); }
}