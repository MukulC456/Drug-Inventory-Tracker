import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Drug, CreateDrug } from '../models/drug.model';

@Injectable({ providedIn: 'root' })
export class DrugService {
  private url = 'https://drug-inventory-api-mukul-a5d0e9b9fhbjbpdd.southindia-01.azurewebsites.net/api/Drugs';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Drug[]>(this.url); }
  getById(id: number) { return this.http.get<Drug>(`${this.url}/${id}`); }
  create(d: CreateDrug) { return this.http.post<Drug>(this.url, d); }
  update(id: number, d: CreateDrug) { return this.http.put(`${this.url}/${id}`, d); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`); }
}