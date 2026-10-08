import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { localeUrlMatcher } from './locale-url-matcher';

describe('localeUrlMatcher', () => {
  it('matches only supported language prefixes', () => {
    const group = new UrlSegmentGroup([], {});
    const route: Route = { matcher: localeUrlMatcher };
    const english = localeUrlMatcher([new UrlSegment('en', {})], group, route);
    const arabic = localeUrlMatcher([new UrlSegment('ar', {})], group, route);
    const unsupported = localeUrlMatcher([new UrlSegment('fr', {})], group, route);

    expect(english?.posParams?.['locale']?.path).toBe('en');
    expect(arabic?.posParams?.['locale']?.path).toBe('ar');
    expect(unsupported).toBeNull();
  });
});
