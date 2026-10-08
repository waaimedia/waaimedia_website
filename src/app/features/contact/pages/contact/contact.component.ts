import { Component, effect, inject } from '@angular/core';
import { ContactSectionComponent } from '../../../home/components/contact-section/contact-section.component';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

@Component({
  selector: 'app-contact',
  imports: [ContactSectionComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.contactPageTitle} | ${translations.brandName}`,
        description: translations.contactPageDescription,
        locale,
        canonicalPath: `/${locale}/contact`,
        alternatePaths: { en: '/en/contact', ar: '/ar/contact' },
        imageUrl: '/images/contact-us.png',
      });
    });
  }
}
