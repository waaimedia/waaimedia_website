import { localizedUrl } from './localized-url';

describe('localizedUrl', () => {
  it('preserves the route, query, and fragment when switching language', () => {
    expect(localizedUrl('/en/about?preview=true#team', 'ar')).toBe('/ar/about?preview=true#team');
    expect(localizedUrl('/ar/services', 'en')).toBe('/en/services');
  });

  it('adds a locale prefix to an unlocalized path', () => {
    expect(localizedUrl('/about', 'ar')).toBe('/ar/about');
  });
});
