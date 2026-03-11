import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'drugs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/drugs/drugs.component')
      .then(m => m.DrugsComponent)
  },
  {
    path: 'inventory',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/inventory/inventory.component')
      .then(m => m.InventoryComponent)
  },
  {
    path: 'alerts',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/alerts/alerts.component')
      .then(m => m.AlertsComponent)
  },
  {
    path: 'suppliers',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/suppliers/suppliers.component')
      .then(m => m.SuppliersComponent)
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/transactions/transactions.component')
      .then(m => m.TransactionsComponent)
  }
];