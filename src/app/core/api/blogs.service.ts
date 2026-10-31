import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Locale } from '../i18n/locale';

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  name_en: string;
  parent_id: number | null;
}

/** Public representation returned by the Blogs API. */
export interface BlogArticle {
  id: number;
  slug: string | null;
  title: string;
  title_ar: string | null;
  title_en: string | null;
  author_name: string | null;
  author_name_ar: string | null;
  author_name_en: string | null;
  short_description: string | null;
  short_description_ar: string | null;
  short_description_en: string | null;
  content: string | null;
  content_ar: string | null;
  content_en: string | null;
  category_id: number | null;
  category_name: string | null;
  category_name_ar: string | null;
  category_name_en: string | null;
  category: BlogCategory | null;
  featured_image_url: string | null;
  published_at: string | null;
}

export interface BlogListResponse {
  data: BlogArticle[];
  links?: Record<string, string | null>;
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

interface BlogResponse {
  data: BlogArticle;
}

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/blogs`;
  private readonly latestCache = new Map<string, Observable<BlogListResponse>>();

  latest(locale: Locale, limit = 3): Observable<BlogListResponse> {
    const cacheKey = `${locale}:${limit}`;
    const cached = this.latestCache.get(cacheKey);
    if (cached) return cached;

    const request = this.http.get<BlogListResponse>(`${this.endpoint}/latest`, {
      headers: this.languageHeaders(locale),
      params: new HttpParams().set('limit', String(limit)),
    }).pipe(
      map((response) => this.localizeListResponse(response, locale)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.latestCache.set(cacheKey, request);
    return request;
  }

  list(locale: Locale, options: { perPage?: number; page?: number; category?: string } = {}): Observable<BlogListResponse> {
    let params = new HttpParams().set('per_page', String(options.perPage ?? 100));
    if (options.page) params = params.set('page', String(options.page));
    if (options.category) params = params.set('category', options.category);

    return this.http.get<BlogListResponse>(this.endpoint, {
      headers: this.languageHeaders(locale),
      params,
    }).pipe(map((response) => this.localizeListResponse(response, locale)));
  }

  getByIdentifier(locale: Locale, identifier: string): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.endpoint}/${encodeURIComponent(identifier)}`, {
      headers: this.languageHeaders(locale),
    }).pipe(
      map((response) => ({
        ...response,
        data: this.localizeArticle(response.data, locale),
      })),
    );
  }

  /**
   * The Blog endpoint returns language-specific fields (`title_en`, `content_ar`, etc.)
   * instead of the localized aliases returned by the News endpoint. Normalize it here so
   * every consumer, including the details page, can use the same article fields.
   */
  private localizeListResponse(response: BlogListResponse, locale: Locale): BlogListResponse {
    return {
      ...response,
      data: response.data.map((article) => this.localizeArticle(article, locale)),
    };
  }

  private localizeArticle(article: BlogArticle, locale: Locale): BlogArticle {
    const suffix = locale === 'ar' ? 'ar' : 'en';
    const localized = (field: 'title' | 'author_name' | 'short_description' | 'content' | 'category_name') =>
      article[`${field}_${suffix}` as keyof BlogArticle] as string | null | undefined;

    return {
      ...article,
      title: article.title || localized('title') || '',
      author_name: article.author_name || localized('author_name') || null,
      short_description: article.short_description || localized('short_description') || null,
      content: article.content || localized('content') || null,
      category_name: article.category_name || localized('category_name') || null,
    };
  }

  private languageHeaders(locale: Locale): HttpHeaders {
    return new HttpHeaders({ 'Accept-Language': locale });
  }
}
