import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private url = 'https://https://drug-inventory-api-mukul-a5d0e9b9fhbjbpdd.southindia-01.azurewebsites.net/api/suppliers';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Supplier[]>(this.url); }
  create(s: any) { return this.http.post<Supplier>(this.url, s); }
  update(id: number, s: any) { return this.http.put(`${this.url}/${id}`, s); }
}