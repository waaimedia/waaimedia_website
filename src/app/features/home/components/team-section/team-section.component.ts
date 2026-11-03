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
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import { TeamMember, TeamMembersLoadState, TeamMembersService } from '../../../../core/api/team-members.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-team-section',
  templateUrl: './team-section.component.html',
  styleUrl: './team-section.component.scss',
})
export class TeamSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('teamSwiper') private readonly swiperElement?: ElementRef<HTMLElement>;

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

  protected movePrevious(): void {
    this.moveByOne('previous');
  }

  protected moveNext(): void {
    this.moveByOne('next');
  }

  private moveByOne(direction: 'previous' | 'next'): void {
    const slider = this.slider;
    if (!slider || slider.destroyed) return;

    // Freeze the marquee at its visible position before navigating. Otherwise a
    // click targets the slide where the long autoplay transition will end, which
    // can look like a backwards movement instead of a one-card step.
    slider.autoplay.stop();
    slider.setTransition(0);
    slider.setTranslate(slider.getTranslate());
    slider.updateActiveIndex();
    slider.updateSlidesClasses();

    if (direction === 'previous') {
      slider.slidePrev(500);
    } else {
      slider.slideNext(500);
    }

    slider.once('transitionEnd', () => {
      if (!slider.destroyed) slider.autoplay.start();
    });
  }

  private scheduleSliderSync(): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.createOrUpdateSlider());
  }

  private createOrUpdateSlider(): void {
    if (!this.isBrowser || !this.swiperElement) return;

    if (this.slider) {
      this.slider.update();
      return;
    }

    this.slider = new Swiper(this.swiperElement.nativeElement, {
      modules: [A11y, Autoplay, Keyboard],
      slidesPerView: 'auto',
      spaceBetween: 18,
      // A zero autoplay delay with a long transition creates a continuous ticker.
      speed: 4200,
      // Keep navigation continuous: after the last team member, return to the first.
      loop: true,
      // The continuous autoplay is always mid-transition. Allow the arrow controls
      // to interrupt that transition instead of ignoring their clicks.
      loopPreventsSliding: false,
      centerInsufficientSlides: true,
      watchOverflow: false,
      grabCursor: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      observer: true,
      observeParents: true,
      resizeObserver: true,
      keyboard: { enabled: true },
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
