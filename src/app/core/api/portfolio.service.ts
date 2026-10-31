import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Locale } from '../i18n/locale';

export interface PortfolioCategorySummary {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
}

export interface PortfolioClient {
  readonly id: number;
  readonly name: string;
  readonly logo_url: string | null;
}

export interface PortfolioMedia {
  readonly id: number;
  readonly image_url: string | null;
  readonly url: string | null;
}

export interface PortfolioCard {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly title_en: string;
  readonly title_ar: string | null;
  readonly cover_image_url: string | null;
  readonly client: PortfolioClient;
  readonly category: PortfolioCategorySummary;
  readonly subcategory: PortfolioCategorySummary | null;
  readonly kind: 'images' | 'images_with_url' | 'video_urls' | 'web_design';
  readonly published_at: string;
}

export interface PortfolioSibling {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly cover_image_url: string | null;
  readonly subcategory: PortfolioCategorySummary | null;
  readonly is_current: boolean;
}

export interface PortfolioDetails extends PortfolioCard {
  readonly media: readonly PortfolioMedia[];
  readonly link_1: string | null;
  readonly link_2: string | null;
  readonly link_3: string | null;
  readonly client_category_items: readonly PortfolioSibling[];
}

export interface PortfolioClientCard extends PortfolioClient {
  readonly category: PortfolioCategorySummary;
  readonly published_items_count: number;
}

export interface PortfolioClientNavigationItem {
  readonly portfolio_id: number;
  readonly title: string;
  readonly cover_image_url: string | null;
  readonly subcategory: PortfolioCategorySummary | null;
  readonly published_at: string;
}

export interface PortfolioClientNavigation {
  readonly client: PortfolioClient;
  readonly category: PortfolioCategorySummary;
  readonly default_portfolio_id: number;
  readonly items: readonly PortfolioClientNavigationItem[];
}

export interface PaginationMeta {
  readonly current_page: number;
  readonly last_page: number;
  readonly per_page: number;
  readonly total: number;
}

export interface PortfolioListResponse<T> {
  readonly data: readonly T[];
  readonly links?: Record<string, string | null>;
  readonly meta?: PaginationMeta;
}

interface PortfolioResponse {
  readonly data: PortfolioDetails;
}

interface PortfolioNavigationResponse {
  readonly data: PortfolioClientNavigation;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/portfolio`;

  list(
    locale: Locale,
    options: { categoryId?: number; subcategoryId?: number; clientId?: number; page?: number; perPage?: number } = {},
  ): Observable<PortfolioListResponse<PortfolioCard>> {
    let params = this.paginationParams(options);
    if (options.categoryId) params = params.set('category_id', String(options.categoryId));
    if (options.subcategoryId) params = params.set('subcategory_id', String(options.subcategoryId));
    if (options.clientId) params = params.set('client_id', String(options.clientId));

    return this.http.get<PortfolioListResponse<PortfolioCard>>(this.endpoint, {
      headers: this.languageHeaders(locale),
      params,
    });
  }

  getByIdentifier(locale: Locale, identifier: string | number): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.endpoint}/${encodeURIComponent(String(identifier))}`, {
      headers: this.languageHeaders(locale),
    });
  }

  clients(
    locale: Locale,
    categoryId: number,
    options: { page?: number; perPage?: number } = {},
  ): Observable<PortfolioListResponse<PortfolioClientCard>> {
    return this.http.get<PortfolioListResponse<PortfolioClientCard>>(`${this.endpoint}/clients`, {
      headers: this.languageHeaders(locale),
      params: this.paginationParams(options).set('category_id', String(categoryId)),
    });
  }

  clientNavigation(
    locale: Locale,
    clientId: number,
    categoryId: number,
  ): Observable<PortfolioNavigationResponse> {
    return this.http.get<PortfolioNavigationResponse>(`${this.endpoint}/clients/${clientId}`, {
      headers: this.languageHeaders(locale),
      params: new HttpParams().set('category_id', String(categoryId)),
    });
  }

  private paginationParams(options: { page?: number; perPage?: number }): HttpParams {
    let params = new HttpParams();
    if (options.page) params = params.set('page', String(options.page));
    if (options.perPage) params = params.set('per_page', String(options.perPage));
    return params;
  }

  private languageHeaders(locale: Locale): HttpHeaders {
    return new HttpHeaders({ 'Accept-Language': locale });
  }
}
