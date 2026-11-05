import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * These routes are written to standalone HTML files during `npm run build`.
 * Keep this list aligned with the indexable routes in `public/sitemap.xml`.
 *
 * Article, event, and portfolio-detail URLs are intentionally client-rendered
 * as their data changes independently of a frontend deployment. The Apache
 * fallback in `public/.htaccess` keeps those URLs working on static hosting.
 */
const localizedStaticRoutes = [
  ':locale',
  ':locale/about',
  ':locale/services',
  ':locale/portfolio',
  ':locale/blogs',
  ':locale/news',
  ':locale/events',
  ':locale/contact',
] as const;

const localeParams = async () => [{ locale: 'en' }, { locale: 'ar' }];

function localizedPrerender(path: string): ServerRoute {
  return {
    path,
    renderMode: RenderMode.Prerender,
    fallback: undefined,
    getPrerenderParams: localeParams,
  };
}

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  ...localizedStaticRoutes.map(localizedPrerender),
  // Freshly published dynamic content is handled by the hydrated Angular app.
  { path: '**', renderMode: RenderMode.Client },
];
