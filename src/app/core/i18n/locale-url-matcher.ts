import { CanMatchFn, UrlMatcher } from '@angular/router';
import { isLocale } from './locale';

/**
 * Restricts the standard `:locale` route to supported locales. Using a normal
 * path instead of only a UrlMatcher lets Angular discover and prerender routes.
 */
export const localeCanMatch: CanMatchFn = (_route, segments) => isLocale(segments[0]?.path);

export const localeUrlMatcher: UrlMatcher = (segments) => {
  const localeSegment = segments[0];

  if (!localeSegment || !isLocale(localeSegment.path)) {
    return null;
  }

  return {
    consumed: [localeSegment],
    posParams: { locale: localeSegment },
  };
};
