import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { INVERSE_LOGO_SRC } from '../../../../layout/public-site.config';

@Component({
  selector: 'app-home-video-section',
  imports: [NgOptimizedImage],
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
})
export class VideoSectionComponent {
  // CMS-backed media will populate these values without changing this shell.
  protected readonly videoUrl: string | null = '/videos/waai.mp4';
  protected readonly posterUrl: string | null = null;
  protected readonly logoSrc = INVERSE_LOGO_SRC;
}
