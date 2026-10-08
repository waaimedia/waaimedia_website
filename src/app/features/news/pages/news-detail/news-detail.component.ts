import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface NewsDetail {
  title: string;
  author: string;
  date: string;
  summary: string;
  image: string;
}

const NEWS_DETAILS: Record<string, NewsDetail> = {
  'waai-media-highlights': {
    title: 'Waai Media Highlights',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Waai Media proudly participated in Futon Media Expo in Turkey, strengthening its regional presence and building partnerships with top media innovators across Europe and the Middle East.',
    image: '/images/card-img.jpg',
  },
  'digital-marketing-summit-dubai-2025': {
    title: 'Digital Marketing Summit – Dubai 2025',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Leading brands and agencies gathered at the Digital Marketing Summit in Dubai to explore the future of marketing and the opportunities shaping the industry.',
    image: '/images/card-img.jpg',
  },
  'global-influencer-marketing-forum-barcelona': {
    title: 'Global Influencer Marketing Forum – Barcelona',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'The Global Influencer Marketing Forum in Barcelona brought together creators, agencies, and digital leaders to exchange ideas and build meaningful partnerships.',
    image: '/images/card-img.jpg',
  },
};

@Component({
  selector: 'app-news-detail',
  imports: [],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly news =
    NEWS_DETAILS[this.slug] ?? NEWS_DETAILS['waai-media-highlights'];

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${this.news.title} | ${translations.brandName}`,
        description: this.news.summary,
        locale,
        canonicalPath: `/${locale}/news/${this.slug}`,
        alternatePaths: {
          en: `/en/news/${this.slug}`,
          ar: `/ar/news/${this.slug}`,
        },
        imageUrl: this.news.image,
      });
    });
  }
}
