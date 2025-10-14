import { Routes } from '@angular/router';

export const routes: Routes = [
  //  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('').then((c) => c.AuthComponent),
  //   children: [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () =>
      import('./Components/over-view/over-view.component').then(
        (c) => c.OverViewComponent
      ),
    title: 'overview',
  },
];
