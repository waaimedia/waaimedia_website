import { Locale } from './locale';

const LOCALE_PREFIX = /^\/(?:en|ar)(?=\/|[?#]|$)/;

export function localizedUrl(url: string, locale: Locale): string {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

  if (LOCALE_PREFIX.test(normalizedUrl)) {
    return normalizedUrl.replace(LOCALE_PREFIX, `/${locale}`);
  }

  return `/${locale}${normalizedUrl}`;
}
