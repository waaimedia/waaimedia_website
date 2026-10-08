import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_PORTFOLIO } from '../../data/home.mock-data';
@Component({
  selector: 'app-home-portfolio-section',
  imports: [RouterLink],
  templateUrl: './portfolio-section.component.html',
  styleUrl: './portfolio-section.component.scss',
})
export class PortfolioSectionComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly items = HOME_PORTFOLIO;
}
