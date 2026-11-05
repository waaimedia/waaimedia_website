import { isPlatformServer } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/core';
import { LocaleService } from '../../core/i18n/locale.service';
import { SocialLinkConfig, SOCIAL_LINKS } from '../public-site.config';

const SERVER_DATE_KEY = makeStateKey<string>('waai-public-layout-date');

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);
  private readonly localeService = inject(LocaleService);
  protected readonly isoDate = this.readStableDate();

  protected readonly i18n = this.localeService;
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat(this.localeService.locale(), {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${this.isoDate}T12:00:00.000Z`)),
  );

  protected socialLabel(social: SocialLinkConfig): string {
    return this.i18n.translations()[social.labelKey];
  }

  private readStableDate(): string {
    const isServer = isPlatformServer(this.platformId);

    if (isServer) {
      const today = new Date().toISOString().slice(0, 10);
      this.transferState.set(SERVER_DATE_KEY, today);
      return today;
    }

    const today = this.transferState.get(SERVER_DATE_KEY, new Date().toISOString().slice(0, 10));
    this.transferState.remove(SERVER_DATE_KEY);
    return today;
  }
}
