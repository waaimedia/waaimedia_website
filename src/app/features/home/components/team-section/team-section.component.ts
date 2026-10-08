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
import { HOME_TEAM } from '../../data/home.mock-data';

@Component({
  selector: 'app-home-team-section',
  templateUrl: './team-section.component.html',
  styleUrl: './team-section.component.scss',
})
export class TeamSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('teamSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;
  @ViewChild('previousButton') private readonly previousButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') private readonly nextButton?: ElementRef<HTMLButtonElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly members = HOME_TEAM;
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
      slidesPerView: 2.15,
      spaceBetween: 18,
      speed: 550,
      loop: true,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      keyboard: { enabled: true },
      navigation: {
        prevEl: this.previousButton.nativeElement,
        nextEl: this.nextButton.nativeElement,
      },
      a11y: {
        prevSlideMessage: 'Previous team members',
        nextSlideMessage: 'Next team members',
      },
      breakpoints: {
        576: { slidesPerView: 3, spaceBetween: 24 },
        768: { slidesPerView: 4, spaceBetween: 28 },
        1024: { slidesPerView: 5, spaceBetween: 32 },
        1200: { slidesPerView: 6, spaceBetween: 36 },
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }

  ngOnDestroy(): void {
    this.slider?.destroy(true, true);
  }
}
