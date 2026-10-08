import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { isLocale } from '../../core/i18n/locale';
import { LocaleService } from '../../core/i18n/locale.service';

@Component({
  selector: 'app-locale-shell',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class LocaleShell {
  private readonly route = inject(ActivatedRoute);
  private readonly localeService = inject(LocaleService);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const locale = params.get('locale');

      if (!isLocale(locale)) {
        throw new Error(`Unsupported locale route parameter: ${locale ?? '(missing)'}`);
      }

      this.localeService.setLocale(locale);
    });
  }
}
