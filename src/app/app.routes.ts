import { Routes } from '@angular/router';
import { localeUrlMatcher } from './core/i18n/locale-url-matcher';
import { LocaleShell } from './layout/locale-shell/locale-shell';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en',
  },
  {
    matcher: localeUrlMatcher,
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
