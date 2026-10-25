import { Component, computed, inject } from '@angular/core';
import { ContactInfoService } from '../../core/api/contact-info.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { WHATSAPP_NUMBER } from '../public-site.config';

@Component({
  selector: 'app-whatsapp-action',
  templateUrl: './whatsapp-action.component.html',
  styleUrl: './whatsapp-action.component.scss',
})
export class WhatsAppActionComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly contactInfoService = inject(ContactInfoService);
  protected readonly href = computed(
    () => this.contactInfoService.contactInfo()?.whatsapp ?? (WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null),
  );
}
