import { Routes } from '@angular/router';
import { UserAuthPage } from './user-auth.page';

export const routes: Routes = [
    {
        path: 'user-auth',
        component: UserAuthPage,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
            },
            {
                path: 'signup',
                loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
            },
            {
                path: '',
                redirectTo: '/user-auth/login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/user-auth/login',
        pathMatch: 'full'
    },
    {
        path: 'parent-confirmation',
        loadComponent: () => import('./signup/parent-confirmation/parent-confirmation.page').then(m => m.ParentConfirmationPage)
    }

]

