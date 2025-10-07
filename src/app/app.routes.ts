import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reports',
    loadComponent: () =>
      import('./feactures/reports/pages/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },

  {
    path: '**',
    redirectTo: 'reports',
  },
];
