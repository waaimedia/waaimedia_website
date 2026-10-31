import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundMusicService } from '../../core/api/background-music.service';
import { ContactInfoService } from '../../core/api/contact-info.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
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
  protected readonly backgroundMusic = inject(BackgroundMusicService);

  private readonly contactInfo = inject(ContactInfoService);
  @ViewChild('backgroundMusicPlayer')
  set backgroundMusicPlayerRef(player: ElementRef<HTMLAudioElement> | undefined) {
    this.backgroundMusicPlayer = player;
    if (player) this.startPlayback(player.nativeElement);
  }

  private backgroundMusicPlayer?: ElementRef<HTMLAudioElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private removeInteractionListener?: () => void;

  constructor() {
    this.contactInfo.load();
    this.backgroundMusic.load();
  }

  ngAfterViewInit(): void {
    const player = this.backgroundMusicPlayer?.nativeElement;
    if (player) this.startPlayback(player);
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
    if (this.removeInteractionListener) return;

    const play = (): void => {
      this.removeInteractionListener?.();
      this.removeInteractionListener = undefined;
      void player.play();
    };

    document.addEventListener('pointerdown', play, { once: true });
    this.removeInteractionListener = () => document.removeEventListener('pointerdown', play);
  }

  private startPlayback(player: HTMLAudioElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Browsers normally reject unmuted autoplay. Try immediately, then retry on
    // the visitor's first interaction so the dashboard setting still takes effect.
    void player.play().catch(() => this.playOnFirstInteraction(player));
  }
}
