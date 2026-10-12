import { Component, inject, input } from '@angular/core';
import { LocaleService } from '../../core/i18n/locale.service';
import { WHATSAPP_NUMBER } from '../public-site.config';

@Component({
  selector: 'app-whatsapp-action',
  templateUrl: './whatsapp-action.component.html',
  styleUrl: './whatsapp-action.component.scss',
})
export class WhatsAppActionComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly href = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null;
}
