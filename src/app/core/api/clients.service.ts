import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Public brand returned by GET /api/v1/clients. */
export interface Client {
  readonly id: number;
  readonly name: string;
  readonly logo_url: string | null;
}

interface ClientsResponse {
  data: Client[];
}

export type ClientsLoadState = 'loading' | 'ready' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/clients`;
  private readonly clientsState: WritableSignal<readonly Client[]> = signal([]);
  private readonly loadState: WritableSignal<ClientsLoadState> = signal('loading');
  private loaded = false;

  /** Public client brands, excluding all private storage and audit fields. */
  readonly clients = this.clientsState.asReadonly();
  /** Request status, used to avoid showing an empty section on API failure. */
  readonly status = this.loadState.asReadonly();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;

    const params = new HttpParams().set('page', '1').set('per_page', '100');
    this.http
      .get<ClientsResponse>(this.endpoint, { params })
      .pipe(
        timeout(10_000),
        catchError(() => {
          this.loadState.set('unavailable');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.clientsState.set(this.validClients(response.data));
        this.loadState.set('ready');
      });
  }

  private validClients(clients: Client[] | null | undefined): readonly Client[] {
    if (!Array.isArray(clients)) return [];

    return clients.filter(
      (client): client is Client =>
        Number.isSafeInteger(client?.id) &&
        typeof client.name === 'string' &&
        client.name.trim().length > 0 &&
        (client.logo_url === null || typeof client.logo_url === 'string'),
    );
  }
}
