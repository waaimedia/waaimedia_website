import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogsService } from '../../../../core/api/blogs.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
@Component({
  selector: 'app-home-blogs-section',
  imports: [RouterLink],
  templateUrl: './blogs-section.component.html',
  styleUrl: './blogs-section.component.scss',
})
export class BlogsSectionComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly items = signal<readonly BlogArticle[]>([]);
  private readonly blogsService = inject(BlogsService);
  private request?: Subscription;

  constructor() {
    effect(() => this.loadBlogs(this.i18n.locale()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  private loadBlogs(locale: 'en' | 'ar'): void {
    this.request?.unsubscribe();
    this.request = this.blogsService.latest(locale, 3).subscribe({
      next: ({ data }) => this.items.set(data),
      error: () => this.items.set([]),
    });
  }
}
