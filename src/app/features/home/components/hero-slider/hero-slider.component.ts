import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { A11y, Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_HERO_SLIDES } from '../../data/home.mock-data';

@Component({
  selector: 'app-home-hero-slider',
  imports: [RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
})
export class HeroSliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;
  @ViewChild('pagination') private readonly paginationElement?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly slides = HOME_HERO_SLIDES;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private slider?: Swiper;

  constructor() {
    effect(() => {
      const direction = this.i18n.direction();
      if (!this.slider) return;
      this.slider.changeLanguageDirection(direction);
      this.slider.update();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.swiperElement || !this.paginationElement) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, Keyboard, Pagination],
      loop: true,
      speed: 650,
      keyboard: { enabled: true },
      autoplay: reducedMotion
        ? false
        : {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      pagination: {
        el: this.paginationElement.nativeElement,
        clickable: true,
        bulletClass: 'hero-slider__bullet',
        bulletActiveClass: 'is-active',
      },
      a11y: {
        prevSlideMessage: 'Previous highlight',
        nextSlideMessage: 'Next highlight',
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }

  ngOnDestroy(): void {
    this.slider?.destroy(true, true);
  }
}
