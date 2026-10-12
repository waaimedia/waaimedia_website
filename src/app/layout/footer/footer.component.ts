import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SocialIconComponent } from '../../shared/social-icon/social-icon.component';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslationKey } from '../../core/i18n/translations';
import { INVERSE_LOGO_SRC, SOCIAL_LINKS } from '../public-site.config';
import { WhatsAppActionComponent } from '../whatsapp-action/whatsapp-action.component';

interface FooterLink {
  readonly key: TranslationKey;
  readonly path: string;
}

const FOOTER_MENU: readonly FooterLink[] = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about' },
  { key: 'services', path: 'services' },
  { key: 'news', path: 'news' },
  { key: 'blogs', path: 'blogs' },
  { key: 'eventsCalendar', path: 'events' },
];

const FOOTER_PORTFOLIO: readonly FooterLink[] = [
  { key: 'footerSocialCampaigns', path: 'portfolio' },
  { key: 'footerMediaProduction', path: 'portfolio' },
  { key: 'footerPublicRelations', path: 'portfolio' },
  { key: 'footerEvents', path: 'events' },
  { key: 'footerOpening', path: 'portfolio' },
  { key: 'footerWebDesign', path: 'portfolio' },
];

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, RouterLink, SocialIconComponent, WhatsAppActionComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localeService = inject(LocaleService);

  protected readonly i18n = this.localeService;
  protected readonly brandLogoSrc = INVERSE_LOGO_SRC;
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly isMobile = signal(false);
  protected readonly expandedGroups = signal<ReadonlySet<string>>(new Set());

  constructor() {}
  protected readonly menuLinks = computed(() =>
    FOOTER_MENU.map((link) => ({
      ...link,
      url: link.path
        ? `/${this.localeService.locale()}/${link.path}`
        : `/${this.localeService.locale()}`,
    })),
  );
  protected readonly portfolioLinks = computed(() =>
    FOOTER_PORTFOLIO.map((link) => ({
      ...link,
      url: `/${this.localeService.locale()}/${link.path}`,
    })),
  );

  protected isGroupExpanded(group: string): boolean {
    return this.expandedGroups().has(group);
  }

  protected syncGroup(group: string, event: Event): void {
    const view = this.document.defaultView;
    const details = event.currentTarget;
    if (!view || !(details instanceof view.HTMLDetailsElement)) {
      return;
    }

    if (!this.isMobile()) {
      details.open = true;
      return;
    }

    this.expandedGroups.update((expanded) => {
      const next = new Set(expanded);
      if (details.open) {
        next.add(group);
      } else {
        next.delete(group);
      }
      return next;
    });
  }
}
