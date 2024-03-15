import { Routes } from '@angular/router';
import { authenticatedGuard } from '@guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('@pages/schedule/schedule.component').then(
        c => c.ScheduleComponent
      ),
  },
  {
    path: 'sign',
    loadComponent: () =>
      import('@pages/sign/sign.component').then(c => c.SignComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('@pages/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [authenticatedGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
