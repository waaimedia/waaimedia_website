import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Locale, directionFor } from './locale';
import { staticTranslations, TranslationKey } from './translations';

const BOOTSTRAP_STYLESHEETS = {
  ltr: { id: 'bootstrap-ltr', href: 'assets/bootstrap/bootstrap.min.css' },
  rtl: { id: 'bootstrap-rtl', href: 'assets/bootstrap/bootstrap.rtl.min.css' },
} as const;

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly currentLocale = signal<Locale>('en');

  readonly locale = this.currentLocale.asReadonly();
  readonly direction = computed(() => directionFor(this.locale()));
  readonly translations = computed(() => staticTranslations[this.locale()]);

  translate(key: TranslationKey): string {
    return staticTranslations[this.locale()][key];
  }

  setLocale(locale: Locale): void {
    const direction = directionFor(locale);
    this.currentLocale.set(locale);
    this.document.documentElement.lang = locale;
    this.document.documentElement.dir = direction;
    this.setStylesheetEnabled(BOOTSTRAP_STYLESHEETS.ltr, direction === 'ltr');
    this.setStylesheetEnabled(BOOTSTRAP_STYLESHEETS.rtl, direction === 'rtl');
    this.title.setTitle(staticTranslations[locale].brandName);
    this.meta.updateTag({
      name: 'description',
      content: staticTranslations[locale].siteDescription,
    });
  }

  private setStylesheetEnabled(
    config: (typeof BOOTSTRAP_STYLESHEETS)[keyof typeof BOOTSTRAP_STYLESHEETS],
    enabled: boolean,
  ): void {
    const stylesheet = this.document.getElementById(config.id);

    if (!stylesheet) {
      return;
    }

    stylesheet.setAttribute('media', enabled ? 'all' : 'not all');
    if (enabled) {
      stylesheet.setAttribute('href', config.href);
      stylesheet.removeAttribute('disabled');
    } else {
      stylesheet.removeAttribute('href');
      stylesheet.setAttribute('disabled', '');
    }
  }
}
