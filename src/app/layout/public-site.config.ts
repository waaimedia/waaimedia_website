export interface SocialLinkConfig {
  readonly platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
  readonly labelKey:
    'socialFacebook' | 'socialInstagram' | 'socialTikTok' | 'socialYouTube' | 'socialLinkedIn';
  readonly href: string | null;
}

/**
 * Shape returned by the site-settings endpoint for the public site's ambient audio.
 * Example API value:
 * { "enabled": true, "url": "https://cdn.example.com/music/brand-theme.mp3", "loop": true }
 */
export interface BackgroundMusicConfig {
  readonly enabled: boolean;
  readonly url: string | null;
  readonly loop: boolean;
}

export const HEADER_LOGO_SRC = '/images/branding/waai-logo-red.svg';
export const INVERSE_LOGO_SRC = '/images/branding/waai-logo-white.svg';

// Configure as an international number without '+' or punctuation.
export const WHATSAPP_NUMBER = '201024940180';

// Replace null URLs with the approved WAAI MEDIA profile URLs.
export const SOCIAL_LINKS: readonly SocialLinkConfig[] = [
  { platform: 'facebook', labelKey: 'socialFacebook', href: null },
  { platform: 'instagram', labelKey: 'socialInstagram', href: null },
  { platform: 'tiktok', labelKey: 'socialTikTok', href: null },
  { platform: 'youtube', labelKey: 'socialYouTube', href: null },
  { platform: 'linkedin', labelKey: 'socialLinkedIn', href: null },
];

// Temporary local example. Replace this object with the settings payload from the backend.
export const BACKGROUND_MUSIC: BackgroundMusicConfig = {
  enabled: false,
  url: '/videos/waai.mp4',
  loop: true,
};
