import { Routes } from '@angular/router';
import { localeCanMatch } from './core/i18n/locale-url-matcher';
import { LocaleShell } from './layout/locale-shell/locale-shell';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en',
  },
  {
    path: ':locale',
    canMatch: [localeCanMatch],
    component: LocaleShell,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layout/public-layout/public.routes').then((module) => module.PUBLIC_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'en',
  },
];
