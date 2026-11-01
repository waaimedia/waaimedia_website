import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Store URLs configured for the public mobile application. */
export interface AppLinks {
  readonly google_app_link: string | null;
  readonly apple_app_store_link: string | null;
}

interface AppLinksResponse {
  data: Partial<AppLinks> | null;
}

@Injectable({ providedIn: 'root' })
export class AppLinksService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/app-links`;
  private readonly appLinksState: WritableSignal<AppLinks | null> = signal(null);
  private loaded = false;

  readonly appLinks = this.appLinksState.asReadonly();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.http
      .get<AppLinksResponse>(this.endpoint)
      .pipe(
        timeout(10_000),
        catchError(() => of({ data: null })),
      )
      .subscribe((response) => this.appLinksState.set(this.normalize(response.data)));
  }

  private normalize(appLinks: Partial<AppLinks> | null | undefined): AppLinks | null {
    if (!appLinks) return null;

    const googleAppLink = this.trimUrl(appLinks.google_app_link);
    const appleAppStoreLink = this.trimUrl(appLinks.apple_app_store_link);

    if (!googleAppLink && !appleAppStoreLink) return null;

    return {
      google_app_link: googleAppLink,
      apple_app_store_link: appleAppStoreLink,
    };
  }

  private trimUrl(value: string | null | undefined): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }
}
