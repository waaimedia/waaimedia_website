import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactInfo {
  phone_1: string;
  phone_2: string | null;
  phone_3: string | null;
  official_email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  whatsapp: string;
  complete_address: string;
  google_maps_url: string;
}

interface ContactInfoResponse {
  data: ContactInfo | null;
}

@Injectable({ providedIn: 'root' })
export class ContactInfoService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/contact-info`;
  private readonly contactInfoState: WritableSignal<ContactInfo | null> = signal(null);
  private loaded = false;

  readonly contactInfo = this.contactInfoState.asReadonly();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.http
      .get<ContactInfoResponse>(this.endpoint)
      .pipe(
        timeout(10_000),
        catchError(() => of({ data: null })),
      )
      .subscribe((response) => this.contactInfoState.set(response.data));
  }
}
