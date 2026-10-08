import { UrlMatcher } from '@angular/router';
import { isLocale } from './locale';

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
