import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';
import { A11y, Autoplay, Keyboard, Navigation } from 'swiper/modules';
import { CalendarEvent, EventsService, EventTimeline } from '../../../../core/api/events.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-events-section',
  imports: [RouterLink],
  templateUrl: './events-section.component.html',
  styleUrl: './events-section.component.scss',
})
export class EventsSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('eventsSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;
  @ViewChild('previousButton') private readonly previousButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') private readonly nextButton?: ElementRef<HTMLButtonElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly events = signal<CalendarEvent[]>([]);
  readonly perPage = input(3);
  readonly timeline = input<EventTimeline>('upcoming');
  readonly emptyVariant = input<'home' | 'calendar'>('home');
  readonly continuous = input(false);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly eventsService = inject(EventsService);
  private slider?: Swiper;
  private eventsRequest?: Subscription;

  constructor() {
    effect(() => {
      const direction = this.i18n.direction();
      if (!this.slider) return;
      this.slider.changeLanguageDirection(direction);
      this.slider.update();
    });
    effect(() => {
      this.i18n.locale();
      this.perPage();
      this.timeline();
      this.loadEvents();
    });
  }

  ngAfterViewInit(): void {
    this.initializeSlider();
  }

  private initializeSlider(): void {
    if (this.slider) return;
    if (!this.isBrowser || !this.swiperElement || !this.previousButton || !this.nextButton) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isContinuous = this.continuous();

    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, Keyboard, Navigation],
      slidesPerView: 1.08,
      spaceBetween: 16,
      // Match the Team section's slow, uninterrupted marquee on the full calendar.
      speed: isContinuous ? 5200 : 700,
      loop: this.events().length > 1,
      loopPreventsSliding: false,
      autoplay: reduceMotion || this.events().length < 2
        ? false
        : isContinuous
          ? {
              delay: 0,
              disableOnInteraction: false,
            }
          : {
              delay: 3400,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
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
    this.eventsRequest?.unsubscribe();
    this.slider?.destroy(true, true);
  }

  protected eventUrl(slug: string): string {
    return `/${this.i18n.locale()}/events/${slug}`;
  }

  protected formatDate(event: CalendarEvent): string {
    if (!event.event_date) return '';
    const date = new Date(`${event.event_date}T${event.event_time || '00:00:00'}`);
    if (Number.isNaN(date.getTime())) return event.event_date;

    return new Intl.DateTimeFormat(this.i18n.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private loadEvents(): void {
    const locale = this.i18n.locale();
    this.eventsRequest?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);
    this.eventsRequest = this.eventsService.list(locale, {
      timeline: this.timeline(),
      perPage: this.perPage(),
    }).subscribe({
      next: ({ data }) => {
        if (!data.length) this.destroySlider();
        this.events.set(data);
        this.loading.set(false);
        setTimeout(() => this.initializeSlider());
        setTimeout(() => this.slider?.update());
      },
      error: () => {
        this.destroySlider();
        this.events.set([]);
        this.loading.set(false);
        this.unavailable.set(true);
      },
    });
  }

  private destroySlider(): void {
    this.slider?.destroy(true, true);
    this.slider = undefined;
  }
}
