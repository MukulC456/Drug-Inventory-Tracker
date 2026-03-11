import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Drug, CreateDrug } from '../models/drug.model';

@Injectable({ providedIn: 'root' })
export class DrugService {
  private url = 'http://localhost:5287/api/drugs';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Drug[]>(this.url); }
  getById(id: number) { return this.http.get<Drug>(`${this.url}/${id}`); }
  create(d: CreateDrug) { return this.http.post<Drug>(this.url, d); }
  update(id: number, d: CreateDrug) { return this.http.put(`${this.url}/${id}`, d); }
  delete(id: number) { return this.http.delete(`${this.url}/${id}`); }
}