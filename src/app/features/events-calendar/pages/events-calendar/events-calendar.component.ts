import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarEvent, EventsService } from '../../../../core/api/events.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-events-calendar',
  imports: [RouterLink],
  templateUrl: './events-calendar.component.html',
  styleUrl: './events-calendar.component.scss',
})
export class EventsCalendarComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly events = signal<CalendarEvent[]>([]);
  private readonly seo = inject(SeoService);
  private readonly eventsService = inject(EventsService);
  private eventsRequest?: Subscription;

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.eventsCalendarTitle} | ${translations.brandName}`,
        description: translations.eventsCalendarPageDescription,
        locale,
        canonicalPath: `/${locale}/events-calendar`,
        alternatePaths: {
          en: '/en/events-calendar',
          ar: '/ar/events-calendar',
        },
        imageUrl: '/images/events-calendar.png',
      });
    });

    effect(() => this.loadEvents());
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
    this.eventsRequest = this.eventsService.list(locale, { timeline: 'all', perPage: 100 }).subscribe({
      next: ({ data }) => this.events.set(data),
      error: () => this.events.set([]),
    });
  }
}
