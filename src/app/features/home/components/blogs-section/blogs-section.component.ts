import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_BLOGS } from '../../data/home.mock-data';
@Component({
  selector: 'app-home-blogs-section',
  imports: [RouterLink],
  templateUrl: './blogs-section.component.html',
  styleUrl: './blogs-section.component.scss',
})
export class BlogsSectionComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly items = HOME_BLOGS;
}
