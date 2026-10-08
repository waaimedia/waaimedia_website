import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface Service {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  protected readonly services: Service[] = [
    {
      title: 'Digital Marketing Strategy',
      description: 'We craft tailored strategies that fit your business goals, analyze your market, and help you stand out from the competition.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Social Media Management',
      description: 'From content creation to community engagement, we handle your social platforms to grow your brand presence and connect with your audience.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Content Creation',
      description: 'Creative visuals, engaging videos, and compelling copy that speak your brand’s voice and capture attention.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Performance Marketing (Paid Ads)',
      description: 'Maximize ROI with data driven campaigns on Facebook, Instagram, Google & more designed to convert clicks into customers.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Branding & Identity',
      description: 'We build brands that people love from logos and color palettes to full visual identities.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Web Design & Development',
      description: 'Modern, responsive websites designed to showcase your brand, generate leads, and drive growth.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Media Partner',
      description: 'Strong collaborations with top media outlets to maximize your exposure and reach the right audience.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Public Relations (PR)',
      description: 'Crafting impactful communication strategies that shape your image and strengthen your reputation.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Events & Activations',
      description: 'Planning and executing memorable events that bring your brand to life and connect you with your audience.',
      icon: '/images/icons/vision.svg',
    },
    {
      title: 'Openings & Launches',
      description: 'Organizing exclusive openings and product launches that leave a lasting first impression.',
      icon: '/images/icons/vision.svg',
    },
  ];

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.servicesTitle} | ${translations.brandName}`,
        description: translations.servicesPageDescription,
        locale,
        canonicalPath: `/${locale}/services`,
        alternatePaths: { en: '/en/services', ar: '/ar/services' },
        imageUrl: '/images/services.png',
      });
    });
  }
}
