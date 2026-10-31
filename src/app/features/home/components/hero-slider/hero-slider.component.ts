import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsArticle, NewsService } from '../../../../core/api/news.service';
import { Locale } from '../../../../core/i18n/locale';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-hero-slider',
  imports: [],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
})
export class HeroSliderComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly slides = signal<readonly NewsArticle[]>([]);
  protected readonly activeSlide = signal(0);
  protected readonly transitionFrom = signal<'left' | 'right'>('right');

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly newsService = inject(NewsService);
  private readonly router = inject(Router);
  private latestRequest?: Subscription;
  private loadedLocale?: Locale;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private dragStartX: number | null = null;
  private hasDragged = false;

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      if (this.loadedLocale === locale) return;
      this.loadedLocale = locale;
      this.loadLatestNews(locale);
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.latestRequest?.unsubscribe();
  }

  private loadLatestNews(locale: Locale): void {
    this.latestRequest?.unsubscribe();
    this.latestRequest = this.newsService.latest(locale, 3).subscribe({
      next: ({ data }) => {
        this.slides.set(data.slice(0, 3));
        this.activeSlide.set(0);
        this.transitionFrom.set('right');
        this.startAutoplay();
      },
      error: () => {
        this.slides.set([]);
        this.stopAutoplay();
      },
    });
  }

  protected goToSlide(index: number): void {
    if (index < 0 || index >= this.slides().length) return;
    this.transitionFrom.set(index >= this.activeSlide() ? 'right' : 'left');
    this.activeSlide.set(index);
    this.startAutoplay();
  }

  protected startDrag(event: PointerEvent): void {
    if (this.slides().length < 2 || event.button !== 0) return;

    this.dragStartX = event.clientX;
    this.hasDragged = false;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.stopAutoplay();
  }

  protected endDrag(event: PointerEvent): void {
    if (this.dragStartX === null) return;

    const dragDistance = event.clientX - this.dragStartX;
    this.dragStartX = null;
    const minimumSwipeDistance = 45;

    if (Math.abs(dragDistance) >= minimumSwipeDistance) {
      this.hasDragged = true;
      const isNext = this.i18n.direction() === 'rtl' ? dragDistance > 0 : dragDistance < 0;
      const slideCount = this.slides().length;
      this.transitionFrom.set(dragDistance < 0 ? 'right' : 'left');
      this.activeSlide.update((current) => (current + (isNext ? 1 : -1) + slideCount) % slideCount);
    }

    this.startAutoplay();
  }

  protected cancelDrag(): void {
    this.dragStartX = null;
    this.startAutoplay();
  }

  protected preventDragClick(event: MouseEvent): void {
    if (!this.hasDragged) return;

    event.preventDefault();
    event.stopPropagation();
    this.hasDragged = false;
  }

  protected openArticle(article: NewsArticle, event: MouseEvent): void {
    event.stopPropagation();
    if (this.hasDragged) {
      event.preventDefault();
      this.hasDragged = false;
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(this.articleUrl(article));
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    if (!this.isBrowser || this.slides().length < 2) return;

    this.autoplayTimer = setInterval(() => {
      this.transitionFrom.set('right');
      this.activeSlide.update((current) => (current + 1) % this.slides().length);
    }, 4500);
  }

  private stopAutoplay(): void {
    if (!this.autoplayTimer) return;
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = undefined;
  }

  private articleUrl(article: NewsArticle): string {
    const identifier = article.slug || article.id;
    return `/${this.i18n.locale()}/news/${encodeURIComponent(identifier)}`;
  }
}
