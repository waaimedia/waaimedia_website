import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientsService } from '../../../../core/api/clients.service';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

type PortfolioCategory =
  | 'all'
  | 'social-media-campaign'
  | 'media-production'
  | 'pr'
  | 'events'
  | 'opening'
  | 'web-design';

interface PortfolioItem {
  readonly id: string;
  readonly clientId: number;
  readonly category: Exclude<PortfolioCategory, 'all'>;
  readonly categoryLabel: { readonly en: string; readonly ar: string };
  readonly title: { readonly en: string; readonly ar: string };
  readonly tone: string;
  readonly imageUrl?: string;
}

const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    id: 'product-launch',
    clientId: 4,
    category: 'social-media-campaign',
    categoryLabel: { en: 'Social Media campaign', ar: 'حملة تواصل اجتماعي' },
    title: { en: 'Product launch campaigns with influencers', ar: 'حملات إطلاق المنتجات مع المؤثرين' },
    tone: 'social',
  },
  {
    id: 'motion-production',
    clientId: 3,
    category: 'media-production',
    categoryLabel: { en: 'Media Production', ar: 'إنتاج إعلامي' },
    title: { en: 'Motion graphics and commercial promo videos', ar: 'موشن جرافيك وفيديوهات ترويجية' },
    tone: 'production',
  },
  {
    id: 'activation-booths',
    clientId: 2,
    category: 'pr',
    categoryLabel: { en: 'PR', ar: 'علاقات عامة' },
    title: { en: 'Live product sampling and activation booths', ar: 'تجارب مباشرة وأجنحة تفعيل للمنتجات' },
    tone: 'pr',
  },
  {
    id: 'live-events',
    clientId: 8,
    category: 'events',
    categoryLabel: { en: 'Events', ar: 'فعاليات' },
    title: { en: 'Audience-first event experiences', ar: 'تجارب فعاليات تضع الجمهور أولًا' },
    tone: 'events',
    imageUrl: '/images/card-img.jpg',
  },
  {
    id: 'opening-campaign',
    clientId: 7,
    category: 'opening',
    categoryLabel: { en: 'Opening', ar: 'افتتاحات' },
    title: { en: 'Memorable opening campaigns', ar: 'حملات افتتاح لا تُنسى' },
    tone: 'opening',
  },
  {
    id: 'web-experiences',
    clientId: 4,
    category: 'web-design',
    categoryLabel: { en: 'Web Design', ar: 'تصميم المواقع' },
    title: { en: 'Digital experiences built to convert', ar: 'تجارب رقمية مصممة لتحقيق النتائج' },
    tone: 'web',
  },
];

const PORTFOLIO_TABS: readonly { readonly id: PortfolioCategory; readonly en: string; readonly ar: string }[] = [
  { id: 'all', en: 'All', ar: 'الكل' },
  { id: 'social-media-campaign', en: 'Social media campaign', ar: 'حملات التواصل الاجتماعي' },
  { id: 'media-production', en: 'Media production', ar: 'الإنتاج الإعلامي' },
  { id: 'pr', en: 'PR', ar: 'العلاقات العامة' },
  { id: 'events', en: 'Events', ar: 'الفعاليات' },
  { id: 'opening', en: 'Opening', ar: 'الافتتاحات' },
  { id: 'web-design', en: 'Web Design', ar: 'تصميم المواقع' },
];

@Component({
  selector: 'app-portfolio',
  imports: [RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly tabs = PORTFOLIO_TABS;
  protected readonly activeTab = signal<PortfolioCategory>('all');
  protected readonly items = computed(() => {
    const activeTab = this.activeTab();
    return activeTab === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeTab);
  });
  protected readonly selectedTab = computed(
    () => PORTFOLIO_TABS.find((tab) => tab.id === this.activeTab()) ?? PORTFOLIO_TABS[0],
  );

  private readonly seo = inject(SeoService);
  private readonly clientsService = inject(ClientsService);
  protected readonly clientItems = this.clientsService.clients;
  protected readonly clientsStatus = this.clientsService.status;

  constructor() {
    const locale = this.i18n.locale();
    const translations = this.i18n.translations();
    this.seo.update({
      title: `${translations.portfolioTitle} | ${translations.brandName}`,
      description: translations.portfolioDescription,
      locale,
      canonicalPath: `/${locale}/portfolio`,
      alternatePaths: { en: '/en/portfolio', ar: '/ar/portfolio' },
    });
    this.clientsService.load();
  }

  protected setActiveTab(tab: PortfolioCategory): void {
    this.activeTab.set(tab);
  }
}
