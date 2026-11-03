import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { Locale, LOCALES } from '../i18n/locale';

export interface PageSeo {
  title: string;
  description: string;
  locale: Locale;
  canonicalPath: string;
  alternatePaths: Record<Locale, string>;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  update(page: PageSeo): void {
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({
      property: 'og:locale',
      content: page.locale === 'ar' ? 'ar_AR' : 'en_US',
    });
    this.meta.updateTag({
      name: 'twitter:card',
      content: page.imageUrl ? 'summary_large_image' : 'summary',
    });

    if (page.imageUrl) {
      const imageUrl = this.absoluteUrl(page.imageUrl);
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    } else {
      this.meta.removeTag("property='og:image'");
      this.meta.removeTag("name='twitter:image'");
    }

    this.setLink('canonical', this.absoluteUrl(page.canonicalPath));

    for (const locale of LOCALES) {
      this.setAlternateLink(locale, this.absoluteUrl(page.alternatePaths[locale]));
    }
    this.setAlternateLink('x-default', this.absoluteUrl(page.alternatePaths.en));
  }

  private absoluteUrl(path: string): string {
    return new URL(path, environment.siteUrl).href;
  }

  private setLink(rel: string, href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      this.document.head.appendChild(link);
    }

    link.href = href;
  }

  private setAlternateLink(locale: Locale | 'x-default', href: string): void {
    const selector = `link[rel="alternate"][hreflang="${locale}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      this.document.head.appendChild(link);
    }

    link.href = href;
  }
}
