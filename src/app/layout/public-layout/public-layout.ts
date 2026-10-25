import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactInfoService } from '../../core/api/contact-info.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { BACKGROUND_MUSIC } from '../public-site.config';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    TopBarComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(LocaleService);
  protected readonly backgroundMusic = BACKGROUND_MUSIC;

  private readonly contactInfo = inject(ContactInfoService);
  @ViewChild('backgroundMusicPlayer')
  private backgroundMusicPlayer?: ElementRef<HTMLAudioElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private removeInteractionListener?: () => void;

  constructor() {
    this.contactInfo.load();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.backgroundMusic.enabled || !this.backgroundMusic.url) {
      return;
    }

    const player = this.backgroundMusicPlayer?.nativeElement;
    if (!player) {
      return;
    }

    // Browsers normally reject unmuted autoplay. Try immediately, then retry on
    // the visitor's first interaction so the dashboard setting still takes effect.
    void player.play().catch(() => this.playOnFirstInteraction(player));
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const player = this.backgroundMusicPlayer?.nativeElement;
      if (player && typeof player.pause === 'function') {
        player.pause();
      }
    }

    this.removeInteractionListener?.();
  }

  private playOnFirstInteraction(player: HTMLAudioElement): void {
    const play = (): void => {
      this.removeInteractionListener?.();
      void player.play();
    };

    document.addEventListener('pointerdown', play, { once: true });
    this.removeInteractionListener = () => document.removeEventListener('pointerdown', play);
  }
}
