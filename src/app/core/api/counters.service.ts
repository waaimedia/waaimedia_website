import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type CounterKey =
  | 'clients_served'
  | 'campaigns_launched'
  | 'social_content_published'
  | 'industries_covered'
  | 'marketing_experts';

export interface Counter {
  id: number;
  key: CounterKey;
  name: string;
  value: number;
  order: number;
}

interface CountersResponse {
  data: Counter[];
}

@Injectable({ providedIn: 'root' })
export class CountersService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/counters`;

  getAll(): Observable<CountersResponse> {
    return this.http.get<CountersResponse>(this.endpoint);
  }
}
