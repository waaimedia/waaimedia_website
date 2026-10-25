export interface SocialLinkConfig {
  readonly platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
  readonly labelKey:
    'socialFacebook' | 'socialInstagram' | 'socialTikTok' | 'socialYouTube' | 'socialLinkedIn';
  readonly href: string | null;
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
