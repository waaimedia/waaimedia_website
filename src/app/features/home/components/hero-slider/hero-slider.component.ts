import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import { NewsArticle, NewsService } from '../../../../core/api/news.service';
import { Locale } from '../../../../core/i18n/locale';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-hero-slider',
  imports: [RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
})
export class HeroSliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly slides = signal<readonly NewsArticle[]>([]);
  protected readonly activeSlide = signal(0);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly newsService = inject(NewsService);
  private slider?: Swiper;
  private latestRequest?: Subscription;
  private loadedLocale?: Locale;
  private viewInitialized = false;
  private syncTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const direction = this.i18n.direction();
      if (!this.slider) return;
      this.slider.changeLanguageDirection(direction);
      this.slider.update();
    });
    effect(() => {
      const locale = this.i18n.locale();
      if (this.loadedLocale === locale) return;
      this.loadedLocale = locale;
      this.loadLatestNews(locale);
    });
    effect(() => {
      if (!this.viewInitialized || !this.slides().length) return;
      this.scheduleSliderSync();
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.slides().length) this.scheduleSliderSync();
  }

  ngOnDestroy(): void {
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.latestRequest?.unsubscribe();
    this.slider?.destroy(true, true);
  }

  private loadLatestNews(locale: Locale): void {
    this.latestRequest?.unsubscribe();
    this.latestRequest = this.newsService.latest(locale, 3).subscribe({
      next: ({ data }) => this.slides.set(data.slice(0, 3)),
      error: () => this.slides.set([]),
    });
    console.log("loadLatestNews" , this.slides() );
    
  }

  private scheduleSliderSync(): void {
    if (this.syncTimer) clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => this.createSlider());
  }

  private createSlider(): void {
    if (!this.isBrowser || !this.swiperElement || !this.slides().length) return;

    this.slider?.destroy(true, true);
    this.activeSlide.set(0);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, Keyboard],
      loop: this.slides().length > 1,
      slidesPerView: 1,
      speed: 650,
      keyboard: { enabled: true },
      autoplay: reducedMotion
        ? false
        : {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      on: {
        slideChange: (swiper) => this.activeSlide.set(swiper.realIndex),
      },
      a11y: {
        prevSlideMessage: 'Previous highlight',
        nextSlideMessage: 'Next highlight',
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }

  protected goToSlide(index: number): void {
    if (!this.slider) return;
    if (this.slider.params.loop) {
      this.slider.slideToLoop(index);
      return;
    }
    this.slider.slideTo(index);
  }
}
