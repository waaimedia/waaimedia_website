import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

type BlogTab =
  | 'latest'
  | 'digitalMarketingTrends'
  | 'caseStudies'
  | 'tipsAndGuides'
  | 'creativeIdeas'
  | 'toolsAndTech'
  | 'behindTheScenes';

interface BlogItem {
  category: Exclude<BlogTab, 'latest'>;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-blogs',
  imports: [RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  protected readonly activeTab = signal<BlogTab>('latest');
  protected readonly tabs: BlogTab[] = [
    'latest',
    'digitalMarketingTrends',
    'caseStudies',
    'tipsAndGuides',
    'creativeIdeas',
    'toolsAndTech',
    'behindTheScenes',
  ];

  protected readonly blogItems: BlogItem[] = [
    {
      category: 'digitalMarketingTrends',
      title: 'What’s Next in Digital Marketing',
      description:
        'Stay ahead of the curve. In this section, we break down the latest trends in digital marketing.',
      image: '/images/card-img.jpg',
    },
    {
      category: 'caseStudies',
      title: 'Real Stories, Real Results',
      description:
        'Real strategies. Real numbers. Real results. Here, we reveal how campaigns were planned.',
      image: '/images/card-img.jpg',
    },
    {
      category: 'tipsAndGuides',
      title: 'Your Marketing Playbook',
      description:
        'Actionable advice you can implement today. From ad optimization to social media growth.',
      image: '/images/card-img.jpg',
    },
    {
      category: 'creativeIdeas',
      title: 'Think Bold. Think Creative.',
      description:
        'Where bold concepts come to life. Explore campaign ideas, content hooks, and more.',
      image: '/images/card-img.jpg',
    },
    {
      category: 'toolsAndTech',
      title: 'Smarter Marketing Starts Here',
      description:
        'Software, automations, and AI solutions every marketer should know.',
      image: '/images/card-img.jpg',
    },
    {
      category: 'behindTheScenes',
      title: 'Inside Waai Media',
      description:
        'A closer look at how we work at Waai Media. Team moments, production snapshots, and client stories.',
      image: '/images/card-img.jpg',
    },
  ];

  protected readonly filteredBlogItems = computed(() => {
    const activeTab = this.activeTab();

    return activeTab === 'latest'
      ? this.blogItems
      : this.blogItems.filter((item) => item.category === activeTab);
  });

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.blogTitle} | ${translations.brandName}`,
        description: translations.blogPageDescription,
        locale,
        canonicalPath: `/${locale}/blogs`,
        alternatePaths: { en: '/en/blogs', ar: '/ar/blogs' },
        imageUrl: '/images/blogs/digital-marketing-trends.jpg',
      });
    });
  }

  protected setActiveTab(tab: BlogTab): void {
    this.activeTab.set(tab);
  }

  protected tabLabel(tab: BlogTab): string {
    const translations = this.i18n.translations();

    switch (tab) {
      case 'digitalMarketingTrends':
        return translations.blogTabDigitalMarketingTrends;
      case 'caseStudies':
        return translations.blogTabCaseStudies;
      case 'tipsAndGuides':
        return translations.blogTabTipsAndGuides;
      case 'creativeIdeas':
        return translations.blogTabCreativeIdeas;
      case 'toolsAndTech':
        return translations.blogTabToolsAndTech;
      case 'behindTheScenes':
        return translations.blogTabBehindTheScenes;
      default:
        return translations.blogTabLatest;
    }
  }

  protected blogSlug(index: number): string {
    return (
      [
        'whats-next-in-digital-marketing',
        'real-stories-real-results',
        'your-marketing-playbook',
        'think-bold-think-creative',
        'smarter-marketing-starts-here',
        'inside-waai-media',
      ][index] ?? 'whats-next-in-digital-marketing'
    );
  }
}
