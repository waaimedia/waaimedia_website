import { Component, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_CONTACT } from '../../data/home.mock-data';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-home-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly i18n = inject(LocaleService);
  protected readonly items = HOME_CONTACT;
  protected readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=World%20Trade%20Center%2C%20Downtown%20Cairo&output=embed',
  );
}
