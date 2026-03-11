import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <span class="logo-icon">💊</span>
          <h1>Drug Inventory</h1>
          <p>Tracker System</p>
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Enter username" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter password" required />
          </div>
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          <button type="submit" [disabled]="loading" class="btn-login">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper { min-height:100vh; background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); display:flex; align-items:center; justify-content:center; }
    .login-card { background:rgba(255,255,255,0.05); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:40px; width:360px; }
    .login-header { text-align:center; margin-bottom:32px; }
    .logo-icon { font-size:48px; }
    h1 { color:#fff; font-size:24px; margin:8px 0 4px; }
    p { color:rgba(255,255,255,0.5); font-size:14px; }
    .form-group { margin-bottom:20px; }
    label { color:rgba(255,255,255,0.7); font-size:13px; display:block; margin-bottom:6px; }
    input { width:100%; padding:12px 16px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff; font-size:15px; box-sizing:border-box; outline:none; }
    input:focus { border-color:#4f8ef7; }
    .btn-login { width:100%; padding:13px; background:#4f8ef7; color:#fff; border:none; border-radius:8px; font-size:16px; font-weight:600; cursor:pointer; margin-top:8px; }
    .btn-login:hover { background:#3a7de8; }
    .error-msg { color:#ff6b6b; font-size:13px; margin-bottom:12px; }
  `]
})
export class LoginComponent {
  username = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {}
  onLogin() {
    this.loading = true; this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid username or password.'; this.loading = false; }
    });
  }
}