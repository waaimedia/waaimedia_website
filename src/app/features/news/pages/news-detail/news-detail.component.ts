import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsArticle, NewsService } from '../../../../core/api/news.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { preserveRichTextColors } from '../../../../shared/rich-content';
import { SocialIconComponent } from '../../../../shared/social-icon/social-icon.component';

interface ShareOption {
  readonly label: string;
  readonly href: string;
  readonly icon: 'facebook' | 'linkedin' | 'whatsapp';
}

@Component({
  selector: 'app-news-detail',
  imports: [SocialIconComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly news = signal<NewsArticle | null>(null);
  protected readonly unavailable = signal(false);
  protected readonly shareOpen = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly newsService = inject(NewsService);
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly identifier = signal('');
  private request?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) =>
    this.identifier.set(params.get('slug') ?? ''),
  );

  constructor() {
    effect(() => this.loadNews(this.i18n.locale(), this.identifier()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  protected formatDate(article: NewsArticle): string {
    if (!article.published_at) return '';
    const date = new Date(article.published_at);
    if (Number.isNaN(date.getTime())) return article.published_at;

    return new Intl.DateTimeFormat(this.i18n.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  protected copyArticleLink(article: NewsArticle): void {
    if (!this.isBrowser) return;

    const url = this.articleUrl(article);
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(url).catch(() => this.copyWithSelection(url));
    } else {
      this.copyWithSelection(url);
    }
    this.shareOpen.set(false);
  }

  protected toggleShareMenu(): void {
    this.shareOpen.update((isOpen) => !isOpen);
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

  private loadNews(locale: 'en' | 'ar', identifier: string): void {
    if (!identifier) return;
    this.request?.unsubscribe();
    this.unavailable.set(false);

    this.request = this.newsService.getByIdentifier(locale, identifier).subscribe({
      next: ({ data }) => {
        this.news.set({ ...data, content: preserveRichTextColors(data.content) });
        this.seo.update({
          title: `${data.title} | ${this.i18n.translations().brandName}`,
          description: data.short_description || this.i18n.translations().newsPageDescription,
          locale,
          canonicalPath: `/${locale}/news/${data.slug || data.id}`,
          alternatePaths: {
            en: `/en/news/${data.slug || data.id}`,
            ar: `/ar/news/${data.slug || data.id}`,
          },
          imageUrl: data.featured_image_url || undefined,
          type: 'article',
        });
      },
      error: () => {
        this.news.set(null);
        this.unavailable.set(true);
      },
    });
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

  private articleUrl(article: NewsArticle): string {
    const identifier = article.slug || article.id;
    const path = `/${this.i18n.locale()}/news/${encodeURIComponent(identifier)}`;
    const origin = this.document.location?.origin;
    return origin ? new URL(path, origin).toString() : path;
  }
}
