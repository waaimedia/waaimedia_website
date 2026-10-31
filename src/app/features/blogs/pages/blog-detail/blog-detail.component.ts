import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogsService } from '../../../../core/api/blogs.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly blog = signal<BlogArticle | null>(null);
  protected readonly unavailable = signal(false);

  private readonly route = inject(ActivatedRoute);
  private readonly blogsService = inject(BlogsService);
  private readonly seo = inject(SeoService);
  private readonly identifier = signal('');
  private request?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) =>
    this.identifier.set(params.get('slug') ?? ''),
  );

  constructor() {
    effect(() => this.loadBlog(this.i18n.locale(), this.identifier()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  protected formatDate(article: BlogArticle): string {
    if (!article.published_at) return '';
    const date = new Date(article.published_at);
    if (Number.isNaN(date.getTime())) return article.published_at;

    return new Intl.DateTimeFormat(this.i18n.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private loadBlog(locale: 'en' | 'ar', identifier: string): void {
    if (!identifier) return;
    this.request?.unsubscribe();
    this.unavailable.set(false);

    this.request = this.blogsService.getByIdentifier(locale, identifier).subscribe({
      next: ({ data }) => {
        this.blog.set(data);
        this.seo.update({
          title: `${data.title} | ${this.i18n.translations().brandName}`,
          description: data.short_description || this.i18n.translations().blogPageDescription,
          locale,
          canonicalPath: `/${locale}/blogs/${data.slug || data.id}`,
          alternatePaths: {
            en: `/en/blogs/${data.slug || data.id}`,
            ar: `/ar/blogs/${data.slug || data.id}`,
          },
          imageUrl: data.featured_image_url || undefined,
        });
      },
      error: () => {
        this.blog.set(null);
        this.unavailable.set(true);
      },
    });
  }
}
