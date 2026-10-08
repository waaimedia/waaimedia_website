import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { TeamSectionComponent } from '../../../home/components/team-section/team-section.component';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, TeamSectionComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.aboutTitle} | ${translations.brandName}`,
        description: translations.aboutPageDescription,
        locale,
        canonicalPath: `/${locale}/about`,
        alternatePaths: { en: '/en/about', ar: '/ar/about' },
        imageUrl: '/images/about-us.png',
      });
    });
  }
}
