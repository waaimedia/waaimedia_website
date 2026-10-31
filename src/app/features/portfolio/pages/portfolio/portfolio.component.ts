import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PortfolioCard,
  PortfolioClientCard,
  PortfolioService,
} from '../../../../core/api/portfolio.service';
import { CategoriesService, PublicCategory } from '../../../../core/api/categories.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

type PortfolioCategory = 'all' | string;

@Component({
  selector: 'app-portfolio',
  imports: [RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly activeTab = signal<PortfolioCategory>('all');
  protected readonly categories = signal<readonly PublicCategory[]>([]);
  protected readonly portfolioItems = signal<readonly PortfolioCard[]>([]);
  protected readonly clientItems = signal<readonly PortfolioClientCard[]>([]);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);
  protected readonly meta = signal<{ currentPage: number; lastPage: number } | null>(null);
  protected readonly selectedTab = computed(
    () => this.categories().find((category) => category.slug === this.activeTab()) ?? null,
  );

  private readonly seo = inject(SeoService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly portfolioService = inject(PortfolioService);
  private categoriesRequest?: Subscription;
  private contentRequest?: Subscription;

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();
      this.seo.update({
        title: `${translations.portfolioTitle} | ${translations.brandName}`,
        description: translations.portfolioDescription,
        locale,
        canonicalPath: `/${locale}/portfolio`,
        alternatePaths: { en: '/en/portfolio', ar: '/ar/portfolio' },
      });
      this.loadCategories(locale);
    });

    effect(() => {
      const locale = this.i18n.locale();
      const activeTab = this.activeTab();
      const category = this.categories().find((item) => item.slug === activeTab);
      if (activeTab === 'all' || category) this.loadContent(locale, category);
    });
  }

  ngOnDestroy(): void {
    this.categoriesRequest?.unsubscribe();
    this.contentRequest?.unsubscribe();
  }

  protected setActiveTab(tab: PortfolioCategory): void {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
  }

  protected loadNextPage(): void {
    const meta = this.meta();
    if (!meta || meta.currentPage >= meta.lastPage || this.loading()) return;
    this.loadContent(this.i18n.locale(), this.selectedTab() ?? undefined, meta.currentPage + 1, true);
  }

  private loadCategories(locale: 'en' | 'ar'): void {
    this.categoriesRequest?.unsubscribe();
    this.categoriesRequest = this.categoriesService.portfolio(locale).subscribe({
      next: ({ data }) => this.categories.set(data),
      error: () => this.categories.set([]),
    });
  }

  private loadContent(
    locale: 'en' | 'ar',
    category?: PublicCategory,
    page = 1,
    append = false,
  ): void {
    this.contentRequest?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);
    if (!append) this.meta.set(null);

    if (category) {
      this.contentRequest = this.portfolioService.clients(locale, category.id, { page, perPage: 12 }).subscribe({
        next: (response) => {
          this.setPagination(response.meta);
          this.clientItems.set(append ? [...this.clientItems(), ...response.data] : response.data);
          this.portfolioItems.set([]);
          this.loading.set(false);
        },
        error: () => this.handleContentError(append),
      });
      return;
    }

    this.contentRequest = this.portfolioService.list(locale, { page, perPage: 12 }).subscribe({
      next: (response) => {
        this.setPagination(response.meta);
        this.portfolioItems.set(append ? [...this.portfolioItems(), ...response.data] : response.data);
        this.clientItems.set([]);
        this.loading.set(false);
      },
      error: () => this.handleContentError(append),
    });
  }

  private setPagination(meta?: { current_page: number; last_page: number }): void {
    this.meta.set(meta ? { currentPage: meta.current_page, lastPage: meta.last_page } : null);
  }

  private handleContentError(append: boolean): void {
    if (!append) {
      this.portfolioItems.set([]);
      this.clientItems.set([]);
    }
    this.loading.set(false);
    this.unavailable.set(true);
  }
}
