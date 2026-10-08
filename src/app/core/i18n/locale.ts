export const LOCALES = ['en', 'ar'] as const;

export type Locale = (typeof LOCALES)[number];
export type TextDirection = 'ltr' | 'rtl';

export function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALES.some((locale) => locale === value);
}

export function directionFor(locale: Locale): TextDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
