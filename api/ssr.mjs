import { reqHandler } from '../dist/media-news-company/server/server.mjs';

/**
 * Adapts every Vercel rewrite to Angular's Express SSR handler while restoring
 * the path the visitor originally requested.
 */
export default function handler(req, res) {
  const requestUrl = new URL(req.url, 'http://localhost');
  const requestedPath = requestUrl.searchParams.get('path') ?? '';

  requestUrl.searchParams.delete('path');
  req.url = `/${requestedPath}${requestUrl.search}`;

  return reqHandler(req, res);
}
