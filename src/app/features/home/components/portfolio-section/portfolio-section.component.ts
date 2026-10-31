import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioCard, PortfolioService } from '../../../../core/api/portfolio.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-portfolio-section',
  imports: [RouterLink],
  templateUrl: './portfolio-section.component.html',
  styleUrl: './portfolio-section.component.scss',
})
export class PortfolioSectionComponent implements OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly items = signal<readonly PortfolioCard[]>([]);
  protected readonly unavailable = signal(false);

  private readonly portfolio = inject(PortfolioService);
  private request?: Subscription;

  constructor() {
    effect(() => this.loadPortfolio(this.i18n.locale()));
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  private loadPortfolio(locale: 'en' | 'ar'): void {
    this.request?.unsubscribe();
    this.unavailable.set(false);
    this.request = this.portfolio.list(locale, { page: 1, perPage: 3 }).subscribe({
      next: ({ data }) => this.items.set(data),
      error: () => {
        this.items.set([]);
        this.unavailable.set(true);
      },
    });
  }
}
