import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://drug-inventory-api-mukul-a5d0e9b9fhbjbpdd.southindia-01.azurewebsites.net/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string; username: string; role: string }>(
      `${this.apiUrl}/login`, { username, password }
    ).pipe(tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      localStorage.setItem('role', res.role);
    }));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken() { return localStorage.getItem('token'); }
  getRole() { return localStorage.getItem('role'); }
  getUsername() { return localStorage.getItem('username'); }
  isLoggedIn() { return !!this.getToken(); }
  isAdmin() { return this.getRole() === 'Admin'; }
}