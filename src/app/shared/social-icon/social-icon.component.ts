import { Component, input } from '@angular/core';

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin';

@Component({
  selector: 'app-social-icon',
  styleUrl: './social-icon.component.scss',
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      @switch (platform()) {
        @case ('instagram') {
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle class="social-icon__dot" cx="18" cy="6" r="1" />
        }
        @case ('facebook') {
          <path
            class="social-icon__filled"
            d="M13.7 21v-8.1h2.7l.4-3.2h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.5v3.2h2.8V21Z"
          />
        }
        @case ('youtube') {
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path class="social-icon__filled" d="m10 9 6 3-6 3Z" />
        }
        @case ('tiktok') {
          <path
            class="social-icon__filled social-icon__tiktok"
            d="M15 3v10.4a4.1 4.1 0 1 1-3.2-4V13a1.1 1.1 0 1 0 .8 1.1V3h3.2c.2 2.2 1.3 3.5 3.2 4v3.1A8 8 0 0 1 15 8.6Z"
          />
        }
        @case ('linkedin') {
          <path
            class="social-icon__filled"
            d="M4.7 8.6h3.2V19H4.7Zm1.6-5.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM10 8.6h3.1V10h.1a3.4 3.4 0 0 1 3-1.6c3.2 0 3.8 2.1 3.8 4.8V19h-3.2v-5.1c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V19H10Z"
          />
        }
      }
    </svg>
  `,
})
export class SocialIconComponent {
  readonly platform = input.required<SocialPlatform>();
}
