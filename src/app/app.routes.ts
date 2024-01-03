import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/user-auth/user-auth.routes').then(m => m.routes)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/tabs/tabs.routes').then( m => m.routes)
  },
];
