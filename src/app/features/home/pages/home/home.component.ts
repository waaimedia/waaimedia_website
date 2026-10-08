import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { BlogsSectionComponent } from '../../components/blogs-section/blogs-section.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';
import { EventsSectionComponent } from '../../components/events-section/events-section.component';
import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { PortfolioSectionComponent } from '../../components/portfolio-section/portfolio-section.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { StatsSectionComponent } from '../../components/stats-section/stats-section.component';
import { TeamSectionComponent } from '../../components/team-section/team-section.component';
import { TrustedBrandsComponent } from '../../components/trusted-brands/trusted-brands.component';
import { VideoSectionComponent } from '../../components/video-section/video-section.component';
@Component({
  selector: 'app-home',
  imports: [
    VideoSectionComponent,
    HeroSliderComponent,
    AboutSectionComponent,
    StatsSectionComponent,
    ServicesSectionComponent,
    PortfolioSectionComponent,
    TrustedBrandsComponent,
    EventsSectionComponent,
    BlogsSectionComponent,
    TeamSectionComponent,
    ContactSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);
  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const t = this.i18n.translations();
      this.seo.update({
        title: t.homeTitle,
        description: t.homeDescription,
        locale,
        canonicalPath: `/${locale}`,
        alternatePaths: { en: '/en', ar: '/ar' },
      });
    });
  }
}
