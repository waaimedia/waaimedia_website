import { Component, computed, effect, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService, PublicCategory } from '../../core/api/categories.service';
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
    '(window:resize)': 'handleWindowResize()',
  },
})
export class HeaderComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private viewportWidth = this.isBrowser ? window.innerWidth : 0;
  private categoriesRequest?: Subscription;

  protected readonly localeService = inject(LocaleService);
  protected readonly menuOpen = signal(false);
  protected readonly newsMenuOpen = signal(false);
  protected readonly newsCategories = signal<readonly PublicCategory[]>([]);
  protected readonly i18n = this.localeService;
  protected readonly brandLogoSrc = HEADER_LOGO_SRC;
  protected readonly homeUrl = computed(() => `/${this.localeService.locale()}`);
  protected readonly navigation = computed(() =>
    NAVIGATION_LINKS.map((link) => ({
      ...link,
      url: link.path ? `/${this.localeService.locale()}/${link.path}` : this.homeUrl(),
    })),
  );

  constructor() {
    effect(() => this.loadNewsCategories(this.localeService.locale()));
  }

  ngOnDestroy(): void {
    this.categoriesRequest?.unsubscribe();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.newsMenuOpen.set(false);
  }

  protected handleWindowResize(): void {
    if (!this.isBrowser) return;

    const width = window.innerWidth;
    // Mobile browsers emit resize events when their address bar collapses while
    // scrolling. Only close the menu when the actual viewport width changes.
    if (width === this.viewportWidth) return;
    this.viewportWidth = width;
    this.closeMenu();
  }

  protected toggleNewsMenu(event: Event): void {
    event.stopPropagation();
    if (this.newsMenuOpen()) {
      this.closeMenu();
      return;
    }
    this.newsMenuOpen.set(true);
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

  private loadNewsCategories(locale: Locale): void {
    this.categoriesRequest?.unsubscribe();
    this.categoriesRequest = this.categoriesService.news(locale).subscribe({
      next: ({ data }) => this.newsCategories.set(data),
      error: () => this.newsCategories.set([]),
    });
  }
}
