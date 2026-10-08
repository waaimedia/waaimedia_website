import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
@Component({
  selector: 'app-home-about-section',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss',
})
export class AboutSectionComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly imageUrl = '/images/about-us.png';
}
