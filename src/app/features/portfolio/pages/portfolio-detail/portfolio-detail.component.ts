import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, map, of, Subscription } from 'rxjs';
import { CategoriesService } from '../../../../core/api/categories.service';
import {
  PortfolioDetails,
  PortfolioService,
  PortfolioSibling,
} from '../../../../core/api/portfolio.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

type WebLinkPlatform = 'behance' | 'figma' | 'dribbble' | 'website';

interface PortfolioSubcategoryGroup {
  readonly id: string;
  readonly name: string;
  readonly isSubcategoryGroup: boolean;
  readonly items: readonly PortfolioSibling[];
}

interface PortfolioProjectSection {
  readonly id: string;
  readonly title: string;
  readonly showTitle: boolean;
  readonly items: readonly PortfolioDetails[];
}

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
  protected readonly groupLoading = signal(false);
  protected readonly activeSubcategoryId = signal<string | null>(null);
  protected readonly projectSections = signal<readonly PortfolioProjectSection[]>([]);
  protected readonly subcategoryGroups = signal<readonly PortfolioSubcategoryGroup[]>([]);
  protected readonly webDesignPortfolio = computed(() => this.item()?.kind === 'web_design');
  protected readonly tabGroups = computed(() =>
    this.subcategoryGroups().filter((group) => group.isSubcategoryGroup),
  );

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
  private groupRequest?: Subscription;
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
    this.groupRequest?.unsubscribe();
  }

  protected selectSubcategoryGroup(group: PortfolioSubcategoryGroup): void {
    if (this.activeSubcategoryId() === group.id || this.groupLoading()) return;
    this.activeSubcategoryId.set(group.id);
    this.loadProjectSections(this.i18n.locale(), group, this.item());
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
        const groups = this.createSubcategoryGroups(data.client_category_items, data);
        const currentGroup = groups.find((group) => group.items.some((sibling) => sibling.id === data.id));
        const hasSubcategories = groups.some((group) => group.isSubcategoryGroup);
        const initialGroup = hasSubcategories
          ? currentGroup ?? groups[0]
          : {
              id: 'all-projects',
              name: data.category.name,
              isSubcategoryGroup: false,
              items: groups.flatMap((group) => group.items),
            };

        this.subcategoryGroups.set(groups);
        this.activeSubcategoryId.set(initialGroup?.id ?? null);
        this.projectSections.set([]);
        if (initialGroup) this.loadProjectSections(locale, initialGroup, data);
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
    this.subcategoryGroups.set([]);
    this.activeSubcategoryId.set(null);
    this.projectSections.set([]);
    this.groupLoading.set(false);
    this.groupRequest?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);
  }

  private fail(): void {
    this.item.set(null);
    this.subcategoryGroups.set([]);
    this.activeSubcategoryId.set(null);
    this.projectSections.set([]);
    this.groupLoading.set(false);
    this.loading.set(false);
    this.unavailable.set(true);
  }

  private createSubcategoryGroups(
    siblings: readonly PortfolioSibling[],
    currentItem: PortfolioDetails,
  ): readonly PortfolioSubcategoryGroup[] {
    const groups = new Map<string, PortfolioSubcategoryGroup>();

    const items = siblings.some((sibling) => sibling.id === currentItem.id)
      ? siblings
      : [
          ...siblings,
          {
            id: currentItem.id,
            slug: currentItem.slug,
            title: currentItem.title,
            cover_image_url: currentItem.cover_image_url,
            subcategory: currentItem.subcategory,
            is_current: true,
          },
        ];

    for (const sibling of items) {
      const id = sibling.subcategory ? `subcategory-${sibling.subcategory.id}` : `item-${sibling.id}`;
      const name = sibling.subcategory?.name || sibling.title;
      const existing = groups.get(id);

      groups.set(
        id,
        existing
          ? { ...existing, items: [...existing.items, sibling] }
          : { id, name, isSubcategoryGroup: Boolean(sibling.subcategory), items: [sibling] },
      );
    }

    return [...groups.values()];
  }

  private loadProjectSections(
    locale: 'en' | 'ar',
    group: PortfolioSubcategoryGroup,
    currentItem: PortfolioDetails | null,
  ): void {
    if (!currentItem) return;
    this.groupRequest?.unsubscribe();
    this.groupLoading.set(true);

    const itemRequests = group.items.map((sibling) =>
      currentItem.id === sibling.id
        ? of(currentItem)
        : this.portfolio.getByIdentifier(locale, sibling.slug || sibling.id).pipe(
            map(({ data }) => data),
            catchError(() => of(null)),
          ),
    );

    this.groupRequest = forkJoin(itemRequests).subscribe({
      next: (items) => {
        const publishedItems = items.filter((item): item is PortfolioDetails => item !== null);
        const splitProjects = group.isSubcategoryGroup && publishedItems.length > 1;
        this.projectSections.set(
          splitProjects
            ? publishedItems.map((item) => ({
                id: `item-${item.id}`,
                title: item.title,
                showTitle: true,
                items: [item],
              }))
            : [{
                id: group.id,
                title: publishedItems.length === 1 ? publishedItems[0].title : group.name,
                showTitle: currentItem.kind !== 'web_design' && publishedItems.length > 0,
                items: publishedItems,
              }],
        );
        this.groupLoading.set(false);
      },
      error: () => this.groupLoading.set(false),
    });
  }
}
