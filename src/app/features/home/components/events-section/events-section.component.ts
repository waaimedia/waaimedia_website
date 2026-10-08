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
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_EVENTS } from '../../data/home.mock-data';

@Component({
  selector: 'app-home-events-section',
  templateUrl: './events-section.component.html',
  styleUrl: './events-section.component.scss',
})
export class EventsSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('eventsSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;
  @ViewChild('previousButton') private readonly previousButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') private readonly nextButton?: ElementRef<HTMLButtonElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly items = HOME_EVENTS;
  protected readonly eventDates: Record<string, string> = {
    expo: 'March 2025',
    campaign: 'November 2025',
    awards: 'December 2025',
  };

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
    if (!this.isBrowser || !this.swiperElement || !this.previousButton || !this.nextButton) return;

    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Keyboard, Navigation],
      slidesPerView: 1.08,
      spaceBetween: 16,
      speed: 550,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      keyboard: { enabled: true },
      navigation: {
        prevEl: this.previousButton.nativeElement,
        nextEl: this.nextButton.nativeElement,
      },
      a11y: {
        prevSlideMessage: 'Previous events',
        nextSlideMessage: 'Next events',
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 24 },
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }

  ngOnDestroy(): void {
    this.slider?.destroy(true, true);
  }
}
