import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Locale } from '../i18n/locale';

export interface PublicCategory {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly parent_id?: number | null;
  readonly children?: readonly PublicCategory[];
}

interface CategoriesResponse {
  readonly data: readonly PublicCategory[];
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/categories`;

  portfolio(locale: Locale): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(this.endpoint, {
      headers: new HttpHeaders({ 'Accept-Language': locale }),
      params: new HttpParams().set('type', 'portfolio'),
    });
  }
}
