import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogArticle, BlogsService } from '../../../../core/api/blogs.service';
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

const CATEGORY_SLUGS: Partial<Record<BlogTab, string>> = {
  digitalMarketingTrends: 'digital-marketing-trends',
  caseStudies: 'case-studied',
  tipsAndGuides: 'tips-guides',
  creativeIdeas: 'creative-ideas',
  toolsAndTech: 'tools-tech',
  behindTheScenes: 'behind-the-scenes',
};

@Component({
  selector: 'app-blogs',
  imports: [RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly activeTab = signal<BlogTab>('latest');
  protected readonly blogItems = signal<readonly BlogArticle[]>([]);
  protected readonly loading = signal(true);
  protected readonly unavailable = signal(false);
  protected readonly tabs: readonly BlogTab[] = [
    'latest',
    'digitalMarketingTrends',
    'caseStudies',
    'tipsAndGuides',
    'creativeIdeas',
    'toolsAndTech',
    'behindTheScenes',
  ];
  protected readonly filteredBlogItems = computed(() => {
    const categorySlug = CATEGORY_SLUGS[this.activeTab()];
    return categorySlug
      ? this.blogItems().filter((item) => item.category?.slug === categorySlug)
      : this.blogItems();
  });

  private readonly seo = inject(SeoService);
  private readonly blogsService = inject(BlogsService);
  private request?: Subscription;

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
    effect(() => this.loadBlogs(this.i18n.locale()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
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

  private loadBlogs(locale: 'en' | 'ar'): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.unavailable.set(false);

    this.request = this.blogsService.list(locale, { perPage: 100 }).subscribe({
      next: ({ data }) => {
        this.blogItems.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.blogItems.set([]);
        this.loading.set(false);
        this.unavailable.set(true);
      },
    });
  }
}
