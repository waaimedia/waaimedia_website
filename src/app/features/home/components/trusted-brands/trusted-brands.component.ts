import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, effect, ElementRef, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import { Client, ClientsLoadState, ClientsService } from '../../../../core/api/clients.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

interface BrandSlide {
  readonly brand: Client;
  readonly duplicate: boolean;
  readonly key: string;
}

@Component({
  selector: 'app-home-trusted-brands',
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss',
})
export class TrustedBrandsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('brandsSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly brands: () => readonly Client[];
  protected readonly status: () => ClientsLoadState;
  protected readonly slides = computed<readonly BrandSlide[]>(() => {
    const brands = this.brands();
    const originalSlides = brands.map((brand) => ({ brand, duplicate: false, key: `${brand.id}-original` }));

    // Five logos can all be visible at once on a wide screen. A second sequence
    // gives Swiper enough slides to create a seamless loop in that situation.
    return brands.length > 1
      ? [...originalSlides, ...brands.map((brand) => ({ brand, duplicate: true, key: `${brand.id}-duplicate` }))]
      : originalSlides;
  });

  private readonly clients = inject(ClientsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private slider?: Swiper;
  private viewInitialized = false;
  private updateTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.brands = this.clients.clients;
    this.status = this.clients.status;
    this.clients.load();

    effect(() => {
      const direction = this.i18n.direction();
      if (!this.slider) return;
      this.slider.changeLanguageDirection(direction);
      this.slider.update();
    });
    effect(() => {
      const status = this.status();
      const brands = this.brands();
      if (!this.viewInitialized || status !== 'ready' || !brands.length) return;
      this.scheduleSliderSync();
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.status() === 'ready' && this.brands().length) this.scheduleSliderSync();
  }

  ngOnDestroy(): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.slider?.destroy(true, true);
  }

  protected initials(name: string): string {
    return name.trim().slice(0, 1).toUpperCase();
  }

  private scheduleSliderSync(): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.createOrUpdateSlider());
  }

  private createOrUpdateSlider(): void {
    if (!this.isBrowser || !this.swiperElement) return;

    if (this.slider) {
      this.slider.update();
      return;
    }

    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, Keyboard],
      slidesPerView: 'auto',
      spaceBetween: 24,
      speed: 4200,
      loop: this.slides().length > 1,
      // Keep a spare slide in the loop so Swiper can rearrange items before the
      // visible edge, rather than doing work as the last card leaves the viewport.
      loopAdditionalSlides: 1,
      loopPreventsSliding: false,
      centerInsufficientSlides: true,
      watchOverflow: false,
      grabCursor: true,
      autoplay: this.brands().length > 1 ? { delay: 0, disableOnInteraction: false } : false,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      keyboard: { enabled: true },
      breakpoints: {
        576: { spaceBetween: 28 },
        768: { spaceBetween: 32 },
        1200: { spaceBetween: 36 },
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }
}
