import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Locale } from '../i18n/locale';

export type EventTimeline = 'upcoming' | 'past' | 'latest' | 'all';

/** Public representation returned by the Event Calendar API. */
export interface CalendarEvent {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  name_ar: string | null;
  description: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  category: string | null;
  category_en?: string | null;
  category_ar?: string | null;
  place: string | null;
  place_en?: string | null;
  place_ar?: string | null;
  event_date: string | null;
  event_time: string | null;
  cover_image_url: string | null;
  url: string | null;
}

export interface EventListResponse {
  data: CalendarEvent[];
  links?: Record<string, string | null>;
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

interface EventResponse {
  data: CalendarEvent;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/events`;

  list(
    locale: Locale,
    options: { timeline?: EventTimeline; perPage?: number; page?: number; category?: string } = {},
  ): Observable<EventListResponse> {
    let params = new HttpParams()
      .set('timeline', options.timeline ?? 'upcoming')
      .set('per_page', String(options.perPage ?? 3));
    if (options.page) params = params.set('page', String(options.page));
    if (options.category) params = params.set('category', options.category);

    return this.http.get<EventListResponse>(this.endpoint, {
      headers: new HttpHeaders({ 'Accept-Language': locale }),
      params,
    });
  }

  getBySlug(locale: Locale, slug: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.endpoint}/${encodeURIComponent(slug)}`, {
      headers: new HttpHeaders({ 'Accept-Language': locale }),
    });
  }
}
