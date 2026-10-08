import { Locale } from '../../../core/i18n/locale';

export type LocalizedText = Record<Locale, string>;
export interface HomeStat {
  id: string;
  value: string;
  label: LocalizedText;
}
export interface HomeCard {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  category?: LocalizedText;
  imageUrl: string | null;
  tone: string;
}
export interface HomeTeamMember {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  imageUrl: string | null;
  tone: string;
}
export interface HomeContactInfo {
  labelKey: 'contactAddress' | 'contactPhones' | 'contactEmail' | 'contactHours';
  valueKey: 'contactAddressValue' | 'contactPhoneValue' | 'contactEmailValue' | 'contactHoursValue';
  icon: string;
}

export interface HomeHeroSlide {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  ctaLabel: LocalizedText;
  ctaUrl: string;
}
