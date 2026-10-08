import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_SERVICES } from '../../data/home.mock-data';
@Component({
  selector: 'app-home-services-section',
  imports: [RouterLink],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss',
})
export class ServicesSectionComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly services = HOME_SERVICES;
}
