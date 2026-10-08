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
import Swiper from 'swiper';
import { A11y, Autoplay, FreeMode } from 'swiper/modules';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_BRANDS } from '../../data/home.mock-data';

@Component({
  selector: 'app-home-trusted-brands',
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss',
})
export class TrustedBrandsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('brandsSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly brands = HOME_BRANDS;

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
    if (!this.isBrowser || !this.swiperElement) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, FreeMode],
      slidesPerView: 2.15,
      spaceBetween: 14,
      speed: 6000,
      loop: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      freeMode: { enabled: true, momentum: false },
      autoplay: reducedMotion
        ? false
        : {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      a11y: { enabled: true },
      breakpoints: {
        576: { slidesPerView: 3.25, spaceBetween: 20 },
        992: { slidesPerView: 5, spaceBetween: 24 },
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }

  ngOnDestroy(): void {
    this.slider?.destroy(true, true);
  }
}
