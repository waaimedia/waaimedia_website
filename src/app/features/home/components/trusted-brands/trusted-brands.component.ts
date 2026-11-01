import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Client, ClientsLoadState, ClientsService } from '../../../../core/api/clients.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-trusted-brands',
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss',
})
export class TrustedBrandsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('brandsSection') private readonly brandsSection?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly brands: () => readonly Client[];
  protected readonly status: () => ClientsLoadState;
  protected readonly tickerActive = signal(false);

  private readonly clients = inject(ClientsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private tickerTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.brands = this.clients.clients;
    this.status = this.clients.status;
    this.clients.load();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.brandsSection || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || this.tickerActive()) return;

        this.tickerTimer = setTimeout(() => this.tickerActive.set(true), 700);
        this.observer?.disconnect();
      },
      { threshold: 0.2 },
    );
    this.observer.observe(this.brandsSection.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.tickerTimer) clearTimeout(this.tickerTimer);
    this.observer?.disconnect();
  }

  protected initials(name: string): string {
    return name.trim().slice(0, 1).toUpperCase();
  }
}
