import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../../../core/api/categories.service';
import { NewsArticle, NewsService } from '../../../../core/api/news.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { SocialIconComponent } from '../../../../shared/social-icon/social-icon.component';

interface ShareOption {
  readonly label: string;
  readonly href: string;
  readonly icon: 'facebook' | 'linkedin' | 'whatsapp';
}

@Component({
  selector: 'app-news',
  imports: [RouterLink, SocialIconComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly newsItems = signal<readonly NewsArticle[]>([]);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);
  protected readonly openShareId = signal<number | null>(null);
  protected readonly categorySlug = signal<string | null>(null);
  protected readonly categoryName = signal('');
  protected readonly isCategoryPage = computed(() => this.categorySlug() !== null);

  private readonly seo = inject(SeoService);
  private readonly newsService = inject(NewsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private request?: Subscription;
  private categoriesRequest?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) =>
    this.categorySlug.set(params.get('category')),
  );

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      const categoryName = this.categoryName();
      const categorySlug = this.categorySlug();

      this.seo.update({
        title: `${categoryName || translations.newsTitle} | ${translations.brandName}`,
        description: translations.newsPageDescription,
        locale,
        canonicalPath: categorySlug ? `/${locale}/news/category/${categorySlug}` : `/${locale}/news`,
        alternatePaths: categorySlug
          ? { en: `/en/news/category/${categorySlug}`, ar: `/ar/news/category/${categorySlug}` }
          : { en: '/en/news', ar: '/ar/news' },
      });
    });
    effect(() => {
      const locale = this.i18n.locale();
      const categorySlug = this.categorySlug();
      this.loadNews(locale, categorySlug ?? undefined);
      this.loadCategoryName(locale, categorySlug);
    });
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.categoriesRequest?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  protected copyArticleLink(article: NewsArticle, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isBrowser) return;

    const url = this.articleUrl(article);
    this.copyText(url);
    this.openShareId.set(null);
  }

  protected toggleShareMenu(article: NewsArticle, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.openShareId.update((openId) => (openId === article.id ? null : article.id));
  }

  protected shareOptions(article: NewsArticle): readonly ShareOption[] {
    const url = this.articleUrl(article);
    const encodedUrl = encodeURIComponent(url);

    return [
      { label: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
      { label: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
      { label: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/?text=${encodedUrl}` },
    ];
  }

  private loadNews(locale: 'en' | 'ar', category?: string): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);

    this.request = this.newsService.list(locale, { perPage: 100, category }).subscribe({
      next: ({ data }) => {
        this.newsItems.set(data);
        if (category && !this.categoryName()) {
          const categoryName = data.find((article) => article.category_name)?.category_name;
          if (categoryName) this.categoryName.set(categoryName);
        }
        this.loading.set(false);
      },
      error: () => {
        this.newsItems.set([]);
        this.loading.set(false);
        this.unavailable.set(true);
      },
    });
  }

  private loadCategoryName(locale: 'en' | 'ar', slug: string | null): void {
    this.categoriesRequest?.unsubscribe();
    this.categoryName.set('');
    if (!slug) return;

    this.categoriesRequest = this.categoriesService.news(locale).subscribe({
      next: ({ data }) => {
        const category = data.find((item) => item.slug === slug);
        this.categoryName.set(category?.name || this.formatCategorySlug(slug));
      },
      error: () => this.categoryName.set(this.formatCategorySlug(slug)),
    });
  }

  private formatCategorySlug(slug: string): string {
    return slug
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private copyText(value: string): void {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value).catch(() => this.copyWithSelection(value));
      return;
    }
    this.copyWithSelection(value);
  }

  private articleUrl(article: NewsArticle): string {
    const identifier = article.slug || article.id;
    const path = `/${this.i18n.locale()}/news/${encodeURIComponent(identifier)}`;
    const origin = this.document.location?.origin;
    return origin ? new URL(path, origin).toString() : path;
  }

  private copyWithSelection(value: string): void {
    const input = this.document.createElement('textarea');
    input.value = value;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    this.document.body.append(input);
    input.select();
    this.document.execCommand('copy');
    input.remove();
  }
}
