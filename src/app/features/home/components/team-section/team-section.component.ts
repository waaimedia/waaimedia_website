import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import Swiper from 'swiper';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import { TeamMember, TeamMembersLoadState, TeamMembersService } from '../../../../core/api/team-members.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-team-section',
  templateUrl: './team-section.component.html',
  styleUrl: './team-section.component.scss',
})
export class TeamSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('teamSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;
  @ViewChild('previousButton') private readonly previousButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') private readonly nextButton?: ElementRef<HTMLButtonElement>;

  protected readonly i18n = inject(LocaleService);
  protected readonly members: () => readonly TeamMember[];
  protected readonly status: () => TeamMembersLoadState;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly teamMembers = inject(TeamMembersService);
  private slider?: Swiper;
  private viewInitialized = false;
  private updateTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.members = this.teamMembers.members;
    this.status = this.teamMembers.status;
    this.teamMembers.load();

    effect(() => {
      const direction = this.i18n.direction();
      if (!this.slider) return;
      this.slider.changeLanguageDirection(direction);
      this.slider.update();
    });
    effect(() => {
      const status = this.status();
      const members = this.members();
      if (!this.viewInitialized || status !== 'ready' || !members.length) return;
      this.scheduleSliderSync();
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.status() === 'ready' && this.members().length) this.scheduleSliderSync();
  }

  ngOnDestroy(): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.slider?.destroy(true, true);
  }

  protected initials(name: string): string {
    return name.trim().slice(0, 1);
  }

  private scheduleSliderSync(): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.createOrUpdateSlider());
  }

  private createOrUpdateSlider(): void {
    if (!this.isBrowser || !this.swiperElement || !this.previousButton || !this.nextButton) return;

    if (this.slider) {
      this.slider.update();
      return;
    }

    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Keyboard, Navigation],
      slidesPerView: 'auto',
      spaceBetween: 18,
      speed: 550,
      loop: false,
      centerInsufficientSlides: true,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      keyboard: { enabled: true },
      navigation: {
        prevEl: this.previousButton.nativeElement,
        nextEl: this.nextButton.nativeElement,
      },
      a11y: {
        prevSlideMessage: 'Previous team members',
        nextSlideMessage: 'Next team members',
      },
      breakpoints: {
        576: { spaceBetween: 24 },
        768: { spaceBetween: 28 },
        1024: { spaceBetween: 32 },
        1200: { spaceBetween: 36 },
      },
    });
    this.slider.changeLanguageDirection(this.i18n.direction());
  }
}
