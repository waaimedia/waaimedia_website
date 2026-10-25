import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Public playback settings returned by GET /api/v1/background-music. */
export interface BackgroundMusicSettings {
  readonly is_enabled: boolean;
  readonly is_loop: boolean;
  readonly audio_url: string | null;
}

interface BackgroundMusicResponse {
  data: BackgroundMusicSettings;
}

const DISABLED_SETTINGS: BackgroundMusicSettings = {
  is_enabled: false,
  is_loop: false,
  audio_url: null,
};

@Injectable({ providedIn: 'root' })
export class BackgroundMusicService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/background-music`;
  private readonly settingsState: WritableSignal<BackgroundMusicSettings> = signal(DISABLED_SETTINGS);
  private loaded = false;

  /** Current public music configuration. It is disabled when the API is unavailable. */
  readonly settings = this.settingsState.asReadonly();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.http
      .get<BackgroundMusicResponse>(this.endpoint)
      .pipe(
        timeout(10_000),
        catchError(() => of({ data: DISABLED_SETTINGS })),
      )
      .subscribe((response) => this.settingsState.set(this.toSettings(response.data)));
  }

  private toSettings(settings: BackgroundMusicSettings | null | undefined): BackgroundMusicSettings {
    if (!settings || settings.is_enabled !== true || typeof settings.audio_url !== 'string' || !settings.audio_url.trim()) {
      return DISABLED_SETTINGS;
    }

    return {
      is_enabled: true,
      is_loop: settings.is_loop === true,
      audio_url: settings.audio_url.trim(),
    };
  }
}
