import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface BlogDetail {
  title: string;
  author: string;
  date: string;
  summary: string;
  image: string;
}

const BLOG_DETAILS: Record<string, BlogDetail> = {
  'whats-next-in-digital-marketing': {
    title: 'What’s Next in Digital Marketing',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Stay ahead of the curve with the latest shifts shaping digital marketing, from evolving audience behavior to new ways brands can create meaningful connections.',
    image: '/images/card-img.jpg',
  },
  'real-stories-real-results': {
    title: 'Real Stories, Real Results',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Explore the thinking, planning, and measurable results behind campaigns that helped brands connect with the right audiences.',
    image: '/images/card-img.jpg',
  },
  'your-marketing-playbook': {
    title: 'Your Marketing Playbook',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Practical marketing advice you can put to work today, from campaign optimization to building stronger social media communities.',
    image: '/images/card-img.jpg',
  },
  'think-bold-think-creative': {
    title: 'Think Bold. Think Creative.',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Discover the ideas, content hooks, and creative thinking that help campaigns stand out in a crowded digital world.',
    image: '/images/card-img.jpg',
  },
  'smarter-marketing-starts-here': {
    title: 'Smarter Marketing Starts Here',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'A closer look at the tools, automations, and AI-powered solutions helping modern marketers work more effectively.',
    image: '/images/card-img.jpg',
  },
  'inside-waai-media': {
    title: 'Inside Waai Media',
    author: 'Writer Name',
    date: 'Mon September 8, 2025',
    summary:
      'Go behind the scenes with the Waai Media team, from production snapshots and creative sessions to the people behind the work.',
    image: '/images/card-img.jpg',
  },
};

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly blog =
    BLOG_DETAILS[this.slug] ?? BLOG_DETAILS['whats-next-in-digital-marketing'];

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${this.blog.title} | ${translations.brandName}`,
        description: this.blog.summary,
        locale,
        canonicalPath: `/${locale}/blogs/${this.slug}`,
        alternatePaths: {
          en: `/en/blogs/${this.slug}`,
          ar: `/ar/blogs/${this.slug}`,
        },
        imageUrl: this.blog.image,
      });
    });
  }
}
