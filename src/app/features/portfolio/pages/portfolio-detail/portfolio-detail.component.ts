import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../../../core/api/categories.service';
import { PortfolioDetails, PortfolioService } from '../../../../core/api/portfolio.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

type WebLinkPlatform = 'behance' | 'figma' | 'dribbble' | 'website';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.scss',
})
export class PortfolioDetailComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly item = signal<PortfolioDetails | null>(null);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly categories = inject(CategoriesService);
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly routeIdentifier = signal<string | null>(null);
  private readonly categorySlug = signal<string | null>(null);
  private readonly clientId = signal<number | null>(null);
  private routeRequest?: Subscription;
  private detailsRequest?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) => {
    this.routeIdentifier.set(params.get('identifier'));
    this.categorySlug.set(params.get('category'));
    const clientId = Number(params.get('clientId'));
    this.clientId.set(Number.isSafeInteger(clientId) && clientId > 0 ? clientId : null);
  });

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const identifier = this.routeIdentifier();
      const categorySlug = this.categorySlug();
      const clientId = this.clientId();

      if (identifier) {
        this.loadItem(locale, identifier);
      } else if (categorySlug && clientId) {
        this.loadClientDefault(locale, categorySlug, clientId);
      } else if (categorySlug) {
        this.loadCategoryDefault(locale, categorySlug);
      } else {
        this.loading.set(false);
        this.unavailable.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.routeRequest?.unsubscribe();
    this.detailsRequest?.unsubscribe();
  }

  protected selectItem(identifier: number | string): void {
    this.loadItem(this.i18n.locale(), identifier);
  }

  protected videoProvider(url: string | null): 'youtube' | 'vimeo' | 'file' | 'external' {
    if (!url) return 'external';
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host === 'youtu.be' || host.endsWith('.youtu.be') || host === 'youtube.com' || host.endsWith('.youtube.com')) {
        return 'youtube';
      }
      if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) return 'vimeo';
      if (/\.(mp4|webm|ogg|ogv|m3u8)$/i.test(parsed.pathname)) return 'file';
    } catch {
      return 'external';
    }
    return 'external';
  }

  protected embedVideoUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      let embedUrl: string | null = null;

      if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        if (id && /^[A-Za-z0-9_-]{6,}$/.test(id)) embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;
      } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
        const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).at(-1);
        if (id && /^[A-Za-z0-9_-]{6,}$/.test(id)) embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;
      } else if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
        const id = parsed.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part));
        if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
      }

      return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
    } catch {
      return null;
    }
  }

  protected webLinkPlatform(url: string): WebLinkPlatform {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host === 'behance.net' || host.endsWith('.behance.net')) return 'behance';
      if (host === 'figma.com' || host.endsWith('.figma.com')) return 'figma';
      if (host === 'dribbble.com' || host.endsWith('.dribbble.com')) return 'dribbble';
    } catch {
      // The backend validates web-design links as http(s), so unknown inputs use the site icon.
    }
    return 'website';
  }

  protected webLinkLabel(url: string): string {
    switch (this.webLinkPlatform(url)) {
      case 'behance':
        return 'Behance';
      case 'figma':
        return 'Figma';
      case 'dribbble':
        return 'Dribbble';
      default:
        return this.i18n.locale() === 'ar' ? 'زيارة الموقع' : 'Visit website';
    }
  }

  private loadClientDefault(locale: 'en' | 'ar', categorySlug: string, clientId: number): void {
    this.startLoading();
    this.routeRequest?.unsubscribe();
    this.routeRequest = this.categories.portfolio(locale).subscribe({
      next: ({ data }) => {
        const category = data.find((item) => item.slug === categorySlug);
        if (!category) return this.fail();
        this.routeRequest = this.portfolio.clientNavigation(locale, clientId, category.id).subscribe({
          next: ({ data }) => this.loadItem(locale, data.default_portfolio_id, false),
          error: () => this.fail(),
        });
      },
      error: () => this.fail(),
    });
  }

  private loadCategoryDefault(locale: 'en' | 'ar', categorySlug: string): void {
    this.startLoading();
    this.routeRequest?.unsubscribe();
    this.routeRequest = this.categories.portfolio(locale).subscribe({
      next: ({ data }) => {
        const category = data.find((item) => item.slug === categorySlug);
        if (!category) return this.fail();
        this.routeRequest = this.portfolio.list(locale, { categoryId: category.id, perPage: 1 }).subscribe({
          next: ({ data: items }) => (items[0] ? this.loadItem(locale, items[0].id, false) : this.fail()),
          error: () => this.fail(),
        });
      },
      error: () => this.fail(),
    });
  }

  private loadItem(locale: 'en' | 'ar', identifier: string | number, reset = true): void {
    if (reset) this.startLoading();
    this.detailsRequest?.unsubscribe();
    this.detailsRequest = this.portfolio.getByIdentifier(locale, identifier).subscribe({
      next: ({ data }) => {
        this.item.set(data);
        this.loading.set(false);
        this.unavailable.set(false);
        this.seo.update({
          title: `${data.title} | ${this.i18n.translations().portfolioTitle}`,
          description: this.i18n.translations().portfolioDescription,
          locale,
          canonicalPath: `/${locale}/portfolio/item/${data.slug}`,
          alternatePaths: { en: `/en/portfolio/item/${data.slug}`, ar: `/ar/portfolio/item/${data.slug}` },
        });
      },
      error: () => this.fail(),
    });
  }

  private startLoading(): void {
    this.item.set(null);
    this.loading.set(true);
    this.unavailable.set(false);
  }

  private fail(): void {
    this.item.set(null);
    this.loading.set(false);
    this.unavailable.set(true);
  }
}
