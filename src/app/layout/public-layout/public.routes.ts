import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout';
import { RoutePlaceholder } from '../route-placeholder/route-placeholder';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../../features/home/pages/home/home.component').then(
            (module) => module.HomeComponent,
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../../features/about/pages/about/about.component').then(
            (module) => module.AboutComponent,
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('../../features/services/pages/services/services.component').then(
            (module) => module.ServicesComponent,
          ),
      },
      { path: 'portfolio', component: RoutePlaceholder, data: { titleKey: 'portfolio' } },
      {
        path: 'blogs',
        loadComponent: () =>
          import('../../features/blogs/pages/blogs/blogs.component').then((m) => m.BlogsComponent),
      },
      {
        path: 'blogs/:slug',
        loadComponent: () =>
          import('../../features/blogs/pages/blog-detail/blog-detail.component').then(
            (m) => m.BlogDetailComponent,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('../../features/contact/pages/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
      },
      {
        path: 'news/:slug',
        loadComponent: () =>
          import('../../features/news/pages/news-detail/news-detail.component').then(
            (m) => m.NewsDetailComponent,
          ),
      },
      {
        path: 'news',
        pathMatch: 'full',
        loadComponent: () =>
          import('../../features/news/pages/news/news.component').then((m) => m.NewsComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../../features/events-calendar/pages/events-calendar/events-calendar.component').then(
            (m) => m.EventsCalendarComponent,
          ),
      },
      {
        path: 'events/:slug',
        loadComponent: () =>
          import('../../features/events-calendar/pages/event-detail/event-detail.component').then(
            (m) => m.EventDetailComponent,
          ),
      },
    ],
  },
];
