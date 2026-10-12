# WAAI MEDIA

Angular 22 standalone public website foundation using SCSS, Bootstrap 5, bilingual routing, and client-side rendering (CSR). Public pages contain temporary navigation placeholders only; page design and backend integrations are not implemented yet.

## Requirements

- Node.js 22.22.3+, 24.15.0+, or 26.0.0+ (within Angular's supported major-version ranges)
- npm

## Development

```bash
npm install
npm start
```

## Build and tests

```bash
npm run build
npm run build -- --configuration development
npm test
```

Production builds replace `src/environments/environment.ts` with `src/environments/environment.production.ts`. Both files currently use placeholder `apiUrl` and `siteUrl` values. Configure both before connecting an API or deploying.

`npm run build` produces a static CSR bundle in `dist/media-news-company/browser`. Deploy that directory to static hosting. The Vercel configuration routes deep links to `index.html`, allowing Angular Router to resolve them in the browser.

`/` redirects to `/en`; `/en` and `/ar` set the document language and direction. Routes render in the browser after the JavaScript bundle loads.

Static UI strings belong in `src/app/core/i18n/translations.ts`; CMS content will come from the future API and should not be added to those dictionaries.

Global layout components are grouped by responsibility under `src/app/layout/` (`top-bar/`, `header/`, `brand-banner/`, `footer/`, and `whatsapp-action/`) and composed by `public-layout/`. The reusable social icon is in `src/app/shared/social-icon/`. The route placeholder exists only to verify localized navigation and SSR. `src/app/layout/public-site.config.ts` holds external link configuration.

The approved logo belongs in `public/assets/brand/waai-media-logo.svg`; no logo asset is currently available, so the global layout uses plain WAAI MEDIA text until it is supplied. Social profile URLs and the WhatsApp number are unset, so their actions stay hidden until official destinations are provided. Franklin, Source Sans Variable, Bahij, and GE Ouhod font files are also not present; system fallbacks are configured until licensed assets are supplied.

Global SCSS entry point: `src/styles.scss`. Figma palette tokens are organized in `src/styles/_variables.scss`. Bootstrap's LTR and RTL stylesheets are selected from the current URL locale.

The `core`, `shared`, `features`, and `layout` directories remain the application boundaries. CSR is enabled; page designs, content APIs, and the admin dashboard are intentionally deferred.
