import { Component, computed, inject } from '@angular/core';
import { ContactInfoService } from '../../../../core/api/contact-info.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_CONTACT } from '../../data/home.mock-data';
import { HomeContactInfo } from '../../models/home.models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-home-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly contactInfoService = inject(ContactInfoService);
  protected readonly i18n = inject(LocaleService);
  protected readonly items = HOME_CONTACT;
  protected readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.contactInfoService.contactInfo()?.google_maps_url ??
        'https://www.google.com/maps?q=World%20Trade%20Center%2C%20Downtown%20Cairo&output=embed',
    ),
  );

  constructor() {
    this.contactInfoService.load();
  }

  protected valueFor(item: HomeContactInfo): string {
    const contactInfo = this.contactInfoService.contactInfo();
    switch (item.valueKey) {
      case 'contactAddressValue':
        return contactInfo?.complete_address ?? this.i18n.translations().contactAddressValue;
      case 'contactPhoneValue': {
        const phones = [contactInfo?.phone_1, contactInfo?.phone_2, contactInfo?.phone_3].filter(
          (phone): phone is string => Boolean(phone),
        );
        return phones.length ? phones.join('\n') : this.i18n.translations().contactPhoneValue;
      }
      case 'contactEmailValue':
        return contactInfo?.official_email ?? this.i18n.translations().contactEmailValue;
      default:
        return this.i18n.translations()[item.valueKey];
    }
  }
}
