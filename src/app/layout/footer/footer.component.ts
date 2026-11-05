import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppLinksService } from '../../core/api/app-links.service';
import { CategoriesService, PublicCategory } from '../../core/api/categories.service';
import { ContactInfoService } from '../../core/api/contact-info.service';
import { Locale } from '../../core/i18n/locale';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslationKey } from '../../core/i18n/translations';
import { INVERSE_LOGO_SRC, SOCIAL_LINKS } from '../public-site.config';
import { WhatsAppActionComponent } from '../whatsapp-action/whatsapp-action.component';

interface FooterLink {
  readonly key: TranslationKey;
  readonly path: string;
}

interface AppStoreLink {
  readonly href: string;
  readonly iconSrc: string;
  readonly labelKey: 'downloadOnAppStore' | 'getItOnGooglePlay';
  readonly promptKey: 'downloadOn' | 'getItOn';
  readonly storeNameKey: 'appStore' | 'googlePlay';
}

const FOOTER_MENU: readonly FooterLink[] = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about' },
  { key: 'services', path: 'services' },
  { key: 'news', path: 'news' },
  { key: 'blogs', path: 'blogs' },
  { key: 'eventsCalendar', path: 'events' },
];

const FOOTER_PORTFOLIO: readonly FooterLink[] = [
  { key: 'footerSocialCampaigns', path: 'portfolio' },
  { key: 'footerMediaProduction', path: 'portfolio' },
  { key: 'footerPublicRelations', path: 'portfolio' },
  { key: 'footerEvents', path: 'events' },
  { key: 'footerOpening', path: 'portfolio' },
  { key: 'footerWebDesign', path: 'portfolio' },
];

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, RouterLink, WhatsAppActionComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  host: {
    '(window:resize)': 'updateViewport()',
  },
})
export class FooterComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly localeService = inject(LocaleService);
  private readonly contactInfoService = inject(ContactInfoService);
  private readonly appLinksService = inject(AppLinksService);
  private readonly categoriesService = inject(CategoriesService);
  private categoriesRequest?: Subscription;

  protected readonly i18n = this.localeService;
  protected readonly brandLogoSrc = INVERSE_LOGO_SRC;
  protected readonly socialLinks = computed(() => {
    const contactInfo = this.contactInfoService.contactInfo();
    return SOCIAL_LINKS.map((link) => ({
      ...link,
      href: contactInfo?.[link.platform]?.trim() || link.href,
    }));
  });
  protected readonly appStoreLinks = computed<readonly AppStoreLink[]>(() => {
    const appLinks = this.appLinksService.appLinks();
    if (!appLinks) return [];

    const storeLinks: Array<AppStoreLink | null> = [
      appLinks.apple_app_store_link
        ? {
            href: appLinks.apple_app_store_link,
            iconSrc: '/images/icons/app-store.svg',
            labelKey: 'downloadOnAppStore' as const,
            promptKey: 'downloadOn' as const,
            storeNameKey: 'appStore' as const,
          }
        : null,
      appLinks.google_app_link
        ? {
            href: appLinks.google_app_link,
            iconSrc: '/images/icons/google-play.svg',
            labelKey: 'getItOnGooglePlay' as const,
            promptKey: 'getItOn' as const,
            storeNameKey: 'googlePlay' as const,
          }
        : null,
    ];

    return storeLinks.filter((link): link is AppStoreLink => link !== null);
  });
  protected readonly contactAddress = computed(
    () => this.contactInfoService.contactInfo()?.complete_address ?? this.i18n.translations().footerContactAddress,
  );
  protected readonly contactPhone = computed(
    () => this.contactInfoService.contactInfo()?.phone_1 ?? this.i18n.translations().footerContactPhone,
  );
  protected readonly contactEmail = computed(
    () => this.contactInfoService.contactInfo()?.official_email ?? this.i18n.translations().footerContactEmail,
  );
  protected readonly isMobile = signal(false);
  protected readonly expandedGroups = signal<ReadonlySet<string>>(new Set());
  protected readonly newsCategories = signal<readonly PublicCategory[]>([]);
  protected readonly newsMenuOpen = signal(false);

  constructor() {
    this.contactInfoService.load();
    this.appLinksService.load();
    this.updateViewport();
    effect(() => this.loadNewsCategories(this.localeService.locale()));
  }

  ngOnDestroy(): void {
    this.categoriesRequest?.unsubscribe();
  }
  protected readonly menuLinks = computed(() =>
    FOOTER_MENU.map((link) => ({
      ...link,
      url: link.path
        ? `/${this.localeService.locale()}/${link.path}`
        : `/${this.localeService.locale()}`,
    })),
  );
  protected readonly portfolioLinks = computed(() =>
    FOOTER_PORTFOLIO.map((link) => ({
      ...link,
      url: `/${this.localeService.locale()}/${link.path}`,
    })),
  );

  protected isGroupExpanded(group: string): boolean {
    return this.expandedGroups().has(group);
  }

  protected syncGroup(group: string, event: Event): void {
    const view = this.document.defaultView;
    const details = event.currentTarget;
    if (!view || !(details instanceof view.HTMLDetailsElement)) {
      return;
    }

    if (!this.isMobile()) {
      details.open = true;
      return;
    }

    this.expandedGroups.update((expanded) => {
      const next = new Set(expanded);
      if (details.open) {
        next.add(group);
      } else {
        next.delete(group);
      }
      return next;
    });
  }

  protected updateViewport(): void {
    this.isMobile.set((this.document.defaultView?.innerWidth ?? Number.POSITIVE_INFINITY) <= 767.98);
  }

  protected toggleNewsMenu(): void {
    this.newsMenuOpen.update((isOpen) => !isOpen);
  }

  private loadNewsCategories(locale: Locale): void {
    this.categoriesRequest?.unsubscribe();
    this.categoriesRequest = this.categoriesService.news(locale).subscribe({
      next: ({ data }) => this.newsCategories.set(data),
      error: () => this.newsCategories.set([]),
    });
  }
}
