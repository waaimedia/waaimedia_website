import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface NewsItem {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-news',
  imports: [RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  protected readonly newsItems: NewsItem[] = [
    {
      title: 'Waai Media Highlights',
      description:
        'Waai Media proudly participated in Futon Media Expo in Turkey, strengthening its regional presence.',
      image: '/images/card-img.jpg',
    },
    {
      title: 'Digital Marketing Summit – Dubai 2025',
      description:
        'Leading brands and agencies gathered at the Digital Marketing Summit in Dubai to explore the future of marketing.',
      image: '/images/card-img.jpg',
    },
    {
      title: 'Global Influencer Marketing Forum – Barcelona',
      description:
        'The Global Influencer Marketing Forum in Barcelona brought together creators, agencies, and digital leaders.',
      image: '/images/card-img.jpg',
    },
    {
      title: 'Waai Media Highlights',
      description:
        'Waai Media proudly participated in Futon Media Expo in Turkey, strengthening its regional presence.',
      image: '/images/card-img.jpg',
    },
    {
      title: 'Digital Marketing Summit – Dubai 2025',
      description:
        'Leading brands and agencies gathered at the Digital Marketing Summit in Dubai to explore the future of marketing.',
      image: '/images/card-img.jpg',
    },
    {
      title: 'Global Influencer Marketing Forum – Barcelona',
      description:
        'The Global Influencer Marketing Forum in Barcelona brought together creators, agencies, and digital leaders.',
      image: '/images/card-img.jpg',
    },
  ];

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.newsTitle} | ${translations.brandName}`,
        description: translations.newsPageDescription,
        locale,
        canonicalPath: `/${locale}/news`,
        alternatePaths: { en: '/en/news', ar: '/ar/news' },
        imageUrl: '/images/news/waai-media-highlights.jpg',
      });
    });
  }

  protected newsSlug(index: number): string {
    return (
      [
      'waai-media-highlights',
      'digital-marketing-summit-dubai-2025',
      'global-influencer-marketing-forum-barcelona',
      ][index % 3] ?? 'waai-media-highlights'
    );
  }
}
