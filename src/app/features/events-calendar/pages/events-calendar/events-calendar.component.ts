import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { EventsSectionComponent } from '@features/home/components/events-section/events-section.component';

interface CalendarEvent {
  category: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

@Component({
  selector: 'app-events-calendar',
  imports: [EventsSectionComponent],
  templateUrl: './events-calendar.component.html',
  styleUrl: './events-calendar.component.scss',
})
export class EventsCalendarComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

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
  }

}
