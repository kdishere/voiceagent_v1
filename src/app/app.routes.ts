import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'patients', 
    loadComponent: () => import('./features/patient-admin/patient-admin.component').then(m => m.PatientAdminComponent) 
  },
  { 
    path: 'follow-up/:id', 
    loadComponent: () => import('./features/follow-up/follow-up.component').then(m => m.FollowUpComponent) 
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];