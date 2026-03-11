import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell" *ngIf="auth.isLoggedIn(); else loginOnly">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">💊</span>
          <span class="logo-text">DrugTrack</span>
        </div>
        <nav>
          <a routerLink="/dashboard"    routerLinkActive="active"><span>📊</span> Dashboard</a>
          <a routerLink="/drugs"        routerLinkActive="active"><span>💊</span> Drugs</a>
          <a routerLink="/inventory"    routerLinkActive="active"><span>📦</span> Inventory</a>
          <a routerLink="/alerts"       routerLinkActive="active"><span>⚠️</span> Alerts</a>
          <a routerLink="/suppliers"    routerLinkActive="active"><span>🚚</span> Suppliers</a>
          <a routerLink="/transactions" routerLinkActive="active"><span>📋</span> Transactions</a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ auth.getUsername()?.charAt(0)?.toUpperCase() }}</div>
            <div>
              <div class="uname">{{ auth.getUsername() }}</div>
              <div class="urole">{{ auth.getRole() }}</div>
            </div>
          </div>
          <button class="btn-logout" (click)="auth.logout()">Logout</button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
    <ng-template #loginOnly>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-shell { display:flex; height:100vh; background:#f8fafc; }
    .sidebar { width:240px; background:#0f172a; display:flex; flex-direction:column; flex-shrink:0; }
    .sidebar-logo { display:flex; align-items:center; gap:10px; padding:24px 20px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .logo-icon { font-size:28px; }
    .logo-text { color:#fff; font-size:18px; font-weight:700; }
    nav { flex:1; padding:12px 10px; display:flex; flex-direction:column; gap:2px; }
    nav a { display:flex; align-items:center; gap:10px; padding:10px 14px; color:rgba(255,255,255,0.6); text-decoration:none; border-radius:8px; font-size:14px; transition:all 0.15s; }
    nav a:hover { background:rgba(255,255,255,0.07); color:#fff; }
    nav a.active { background:rgba(79,142,247,0.2); color:#4f8ef7; font-weight:600; }
    .sidebar-footer { padding:16px; border-top:1px solid rgba(255,255,255,0.08); }
    .user-info { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
    .avatar { width:36px; height:36px; background:#4f8ef7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; }
    .uname { color:#fff; font-size:13px; font-weight:600; }
    .urole { color:rgba(255,255,255,0.4); font-size:11px; }
    .btn-logout { width:100%; padding:8px; background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.6); border:none; border-radius:8px; cursor:pointer; font-size:13px; }
    .btn-logout:hover { background:rgba(255,100,100,0.2); color:#fca5a5; }
    .main-content { flex:1; overflow-y:auto; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}