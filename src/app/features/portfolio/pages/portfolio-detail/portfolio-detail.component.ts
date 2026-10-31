import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService, PublicCategory } from '../../../../core/api/categories.service';
import { ClientsService } from '../../../../core/api/clients.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface GalleryItem {
  readonly id: string;
  readonly tone: string;
  readonly imageUrl?: string;
}

const GALLERY_PLACEHOLDERS: readonly GalleryItem[] = [
  { id: 'one', tone: 'midnight', imageUrl: '/images/card-img.jpg' },
  { id: 'two', tone: 'cream', imageUrl: '/images/about-us.png' },
  { id: 'three', tone: 'garden' },
  { id: 'four', tone: 'ink' },
  { id: 'five', tone: 'sunny' },
  { id: 'six', tone: 'studio', imageUrl: '/images/card-img.jpg' },
];

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.scss',
})
export class PortfolioDetailComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly category = signal<PublicCategory | null>(null);
  protected readonly activeSubcategory = signal<string | null>(null);
  protected readonly galleryItems = GALLERY_PLACEHOLDERS;
  protected readonly unavailable = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly categories = inject(CategoriesService);
  private readonly clients = inject(ClientsService);
  private readonly seo = inject(SeoService);
  private readonly categorySlug = signal('');
  private readonly clientId = signal<number | null>(null);
  protected readonly selectedClient = computed(() => {
    const clientId = this.clientId();
    return clientId === null ? null : this.clients.clients().find((client) => client.id === clientId) ?? null;
  });
  private request?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) => {
    this.categorySlug.set(params.get('category') ?? '');
    const clientId = Number(params.get('clientId'));
    this.clientId.set(Number.isSafeInteger(clientId) && clientId > 0 ? clientId : null);
  });

  constructor() {
    this.clients.load();
    effect(() => this.loadCategory(this.i18n.locale(), this.categorySlug()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  protected setActiveSubcategory(slug: string): void {
    this.activeSubcategory.set(slug);
  }

  private loadCategory(locale: 'en' | 'ar', slug: string): void {
    if (!slug) return;
    this.request?.unsubscribe();
    this.unavailable.set(false);

    this.request = this.categories.portfolio(locale).subscribe({
      next: ({ data }) => {
        const category = data.find((item) => item.slug === slug) ?? null;
        this.category.set(category);
        this.activeSubcategory.set(category?.children?.[0]?.slug ?? null);
        if (!category) this.unavailable.set(true);

        if (category) {
          this.seo.update({
            title: `${category.name} | ${this.i18n.translations().portfolioTitle}`,
            description: this.i18n.translations().portfolioDescription,
            locale,
            canonicalPath: `/${locale}/portfolio/${category.slug}`,
            alternatePaths: {
              en: `/en/portfolio/${category.slug}`,
              ar: `/ar/portfolio/${category.slug}`,
            },
          });
        }
      },
      error: () => {
        this.category.set(null);
        this.unavailable.set(true);
      },
    });
  }
}
