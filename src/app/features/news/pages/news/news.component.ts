import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsArticle, NewsService } from '../../../../core/api/news.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-news',
  imports: [RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly newsItems = signal<readonly NewsArticle[]>([]);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);

  private readonly seo = inject(SeoService);
  private readonly newsService = inject(NewsService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private request?: Subscription;

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.newsTitle} | ${translations.brandName}`,
        description: translations.newsPageDescription,
        locale,
        canonicalPath: `/${locale}/news`,
        alternatePaths: { en: '/en/news', ar: '/ar/news' },
      });
    });
    effect(() => this.loadNews(this.i18n.locale()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  protected copyArticleLink(article: NewsArticle, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isBrowser) return;

    const identifier = article.slug || article.id;
    const url = new URL(`/${this.i18n.locale()}/news/${encodeURIComponent(identifier)}`, this.document.location.origin).toString();
    this.copyText(url);
  }

  private loadNews(locale: 'en' | 'ar'): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);

    this.request = this.newsService.list(locale, { perPage: 100 }).subscribe({
      next: ({ data }) => {
        this.newsItems.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.newsItems.set([]);
        this.loading.set(false);
        this.unavailable.set(true);
      },
    });
  }

  private copyText(value: string): void {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value).catch(() => this.copyWithSelection(value));
      return;
    }
    this.copyWithSelection(value);
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
