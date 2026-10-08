import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { HOME_STATS } from '../../data/home.mock-data';
import { HomeStat } from '../../models/home.models';
@Component({
  selector: 'app-home-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrl: './stats-section.component.scss',
})
export class StatsSectionComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly stats = HOME_STATS;
  protected readonly displayedValues = signal<Record<string, number>>(
    Object.fromEntries(this.stats.map((stat) => [stat.id, 0])),
  );

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer: IntersectionObserver | null = null;
  private animationFrame: number | null = null;
  private hasStarted = false;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (!('IntersectionObserver' in window)) {
      this.startAnimation();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.startAnimation();
          this.observer?.disconnect();
          this.observer = null;
        }
      },
      { threshold: 0.35 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.animationFrame !== null) window.cancelAnimationFrame(this.animationFrame);
  }

  protected formattedValue(stat: HomeStat): string {
    const locale = this.i18n.locale() === 'ar' ? 'ar-EG' : 'en-US';
    return this.displayedValues()[stat.id].toLocaleString(locale);
  }

  private startAnimation(): void {
    if (this.hasStarted) return;
    this.hasStarted = true;

    if (this.prefersReducedMotion() || typeof window.requestAnimationFrame !== 'function') {
      this.setFinalValues();
      return;
    }

    const targets = Object.fromEntries(this.stats.map((stat) => [stat.id, this.targetValue(stat)]));
    const startedAt = performance.now();
    const duration = 1400;
    const update = (now: number): void => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      this.displayedValues.set(
        Object.fromEntries(
          this.stats.map((stat) => [stat.id, Math.round(targets[stat.id] * easedProgress)]),
        ),
      );

      if (progress < 1) this.animationFrame = window.requestAnimationFrame(update);
    };
    this.animationFrame = window.requestAnimationFrame(update);
  }

  private setFinalValues(): void {
    this.displayedValues.set(
      Object.fromEntries(this.stats.map((stat) => [stat.id, this.targetValue(stat)])),
    );
  }

  private targetValue(stat: HomeStat): number {
    return Number.parseInt(stat.value.replace(/\D/g, ''), 10);
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
