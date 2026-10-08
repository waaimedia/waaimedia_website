import { Component, computed, inject, input } from '@angular/core';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslationKey } from '../../core/i18n/translations';

@Component({
  selector: 'app-route-placeholder',
  template: `
    <section class="route-placeholder container" aria-labelledby="placeholder-title">
      <h1 id="placeholder-title">{{ title() }}</h1>
      <p>{{ i18n.translations().placeholderNotice }}</p>
    </section>
  `,
  styleUrl: './route-placeholder.scss',
})
export class RoutePlaceholder {
  private readonly localeService = inject(LocaleService);

  readonly titleKey = input.required<TranslationKey>();
  protected readonly i18n = this.localeService;
  protected readonly title = computed(() => this.localeService.translations()[this.titleKey()]);
}
