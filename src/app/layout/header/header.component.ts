import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Locale } from '../../core/i18n/locale';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslationKey } from '../../core/i18n/translations';
import { localizedUrl } from '../../core/i18n/localized-url';
import { HEADER_LOGO_SRC } from '../public-site.config';

interface NavigationLink {
  readonly key: TranslationKey;
  readonly path: string;
}

const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about' },
  { key: 'services', path: 'services' },
  { key: 'portfolio', path: 'portfolio' },
  { key: 'news', path: 'news' },
  { key: 'blogs', path: 'blogs' },
  { key: 'eventsCalendar', path: 'events' },
  { key: 'contact', path: 'contact' },
];

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(keydown.escape)': 'closeMenu()',
    '(window:resize)': 'closeMenu()',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);

  protected readonly localeService = inject(LocaleService);
  protected readonly menuOpen = signal(false);
  protected readonly i18n = this.localeService;
  protected readonly brandLogoSrc = HEADER_LOGO_SRC;
  protected readonly homeUrl = computed(() => `/${this.localeService.locale()}`);
  protected readonly navigation = computed(() =>
    NAVIGATION_LINKS.map((link) => ({
      ...link,
      url: link.path ? `/${this.localeService.locale()}/${link.path}` : this.homeUrl(),
    })),
  );

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected switchLanguage(): void {
    const currentLocale = this.localeService.locale();
    const nextLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';
    this.closeMenu();
    void this.router.navigateByUrl(localizedUrl(this.router.url, nextLocale));
  }

  protected switchLanguageLabel(): string {
    return this.localeService.locale() === 'en'
      ? this.i18n.translations().switchToArabic
      : this.i18n.translations().switchToEnglish;
  }
}
