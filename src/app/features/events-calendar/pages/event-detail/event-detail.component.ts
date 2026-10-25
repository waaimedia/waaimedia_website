import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarEvent, EventsService } from '../../../../core/api/events.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-event-detail',
  imports: [RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly event = signal<CalendarEvent | null>(null);
  protected readonly unavailable = signal(false);
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);
  private readonly seo = inject(SeoService);
  private readonly slug = signal('');
  private request?: Subscription;
  private readonly routeSubscription = this.route.paramMap.subscribe((params) =>
    this.slug.set(params.get('slug') ?? ''),
  );

  constructor() {
    effect(() => this.loadEvent(this.i18n.locale(), this.slug()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  protected eventsUrl(): string {
    return `/${this.i18n.locale()}/events`;
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

  private loadEvent(locale: 'en' | 'ar', slug: string): void {
    if (!slug) return;
    this.request?.unsubscribe();
    this.unavailable.set(false);

    this.request = this.eventsService.getBySlug(locale, slug).subscribe({
      next: ({ data }) => {
        this.event.set(data);
        this.seo.update({
          title: `${data.name} | ${this.i18n.translations().brandName}`,
          description: data.description || this.i18n.translations().eventsCalendarPageDescription,
          locale,
          canonicalPath: `/${locale}/events/${data.slug}`,
          alternatePaths: {
            en: `/en/events/${data.slug}`,
            ar: `/ar/events/${data.slug}`,
          },
          imageUrl: data.cover_image_url || undefined,
        });
      },
      error: () => {
        this.event.set(null);
        this.unavailable.set(true);
      },
    });
  }
}
