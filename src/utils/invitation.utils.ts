import { enumData } from '@/common/constanst/enumData';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getEnumByCode } from './enum.utils';

export type SectionConfig = Record<string, boolean>;

export type SectionConfigEntryValue =
  | boolean
  | { enabled: boolean; order?: number; variant?: string };

export type SectionConfigEntry = SectionConfigEntryValue;

export type ExtendedSectionConfig = Record<string, SectionConfigEntryValue>;

export interface ThemeLayoutConfig {
  envelopeStyle?: string;
  heroStyle?: string;
  sectionOrder?: string[];
  sectionVariants?: Record<string, string>;
}

const DEFAULT_SECTION_ORDER = [
  'hero',
  'divider',
  'familyInfo',
  'hosts',
  'intro',
  'ceremonies',
  'countdown',
  'gallery',
  'partyInfo',
  'timeline',
  'rsvp',
  'map',
  'guestbook',
  'giftBox',
  'dressCode',
  'thankYou',
];

const SECTION_FLAG_MAP: Record<string, string | null> = {
  hero: enumData.SECTION_FLAG.SHOW_HERO.code,
  divider: null,
  familyInfo: null,
  hosts: null,
  intro: enumData.SECTION_FLAG.SHOW_INTRO.code,
  ceremonies: null,
  countdown: enumData.SECTION_FLAG.SHOW_COUNTDOWN.code,
  gallery: enumData.SECTION_FLAG.SHOW_GALLERY.code,
  partyInfo: null,
  timeline: enumData.SECTION_FLAG.SHOW_TIMELINE.code,
  rsvp: enumData.SECTION_FLAG.SHOW_RSVP.code,
  map: enumData.SECTION_FLAG.SHOW_MAP.code,
  guestbook: enumData.SECTION_FLAG.SHOW_GUESTBOOK.code,
  giftBox: enumData.SECTION_FLAG.SHOW_GIFTS.code,
  dressCode: enumData.SECTION_FLAG.SHOW_DRESS_CODE.code,
  thankYou: enumData.SECTION_FLAG.SHOW_THANK_YOU.code,
};

export function defaultThemeLayout(): string[] {
  return [...DEFAULT_SECTION_ORDER];
}

function normalizeSectionEntry(
  value: SectionConfigEntryValue | undefined,
): { enabled: boolean; order?: number; variant?: string } {
  if (typeof value === 'boolean') return { enabled: value };
  if (value && typeof value === 'object') {
    return {
      enabled: value.enabled !== false,
      order: value.order,
      variant: value.variant,
    };
  }
  return { enabled: true };
}

export function resolveSectionConfig(
  sectionConfig?: SectionConfig | ExtendedSectionConfig,
  themeLayout?: ThemeLayoutConfig | null,
): {
  sectionOrder: string[];
  sectionConfig: ExtendedSectionConfig;
} {
  const normalizedConfig: ExtendedSectionConfig = {};
  for (const [key, value] of Object.entries(sectionConfig || {})) {
    normalizedConfig[key] = value as SectionConfigEntryValue;
  }

  const baseOrder = themeLayout?.sectionOrder?.length
    ? [...themeLayout.sectionOrder]
    : defaultThemeLayout();

  const sortedOrder = [...baseOrder].sort((a, b) => {
    const flagA = SECTION_FLAG_MAP[a];
    const flagB = SECTION_FLAG_MAP[b];
    const orderA =
      (flagA ? normalizeSectionEntry(normalizedConfig[flagA]).order : undefined) ??
      baseOrder.indexOf(a);
    const orderB =
      (flagB ? normalizeSectionEntry(normalizedConfig[flagB]).order : undefined) ??
      baseOrder.indexOf(b);
    return orderA - orderB;
  });

  const seen = new Set<string>();
  const mergedOrder: string[] = [];
  for (const sectionId of sortedOrder) {
    if (seen.has(sectionId)) continue;
    seen.add(sectionId);
    mergedOrder.push(sectionId);
  }

  for (const sectionId of DEFAULT_SECTION_ORDER) {
    if (!seen.has(sectionId)) mergedOrder.push(sectionId);
  }

  return {
    sectionOrder: mergedOrder,
    sectionConfig: normalizedConfig,
  };
}

export function getCardTypeConfig(cardType: string) {
  return getEnumByCode(enumData.CARD_TYPE, cardType);
}

export function defaultSectionConfig(): SectionConfig {
  const flags = enumData.SECTION_FLAG;
  return {
    [flags.SHOW_HERO.code]: true,
    [flags.SHOW_INTRO.code]: true,
    [flags.SHOW_GALLERY.code]: true,
    [flags.SHOW_COUNTDOWN.code]: true,
    [flags.SHOW_MAP.code]: true,
    [flags.SHOW_DRESS_CODE.code]: false,
    [flags.SHOW_TIMELINE.code]: false,
    [flags.SHOW_RSVP.code]: true,
    [flags.SHOW_GUESTBOOK.code]: true,
    [flags.SHOW_GIFTS.code]: true,
    [flags.SHOW_THANK_YOU.code]: true,
    [flags.GUESTBOOK_STATIC.code]: true,
    [flags.GUESTBOOK_FLOATING.code]: true,
  };
}

export function defaultMusicConfig() {
  return {
    url: '',
    type: enumData.MUSIC_TYPE.UPLOAD.code,
    autoplay: false,
    name: '',
  };
}

export function defaultEnabledModules(cardType: string): string[] {
  return getCardTypeConfig(cardType)?.defaultModules ?? [];
}

export function defaultGuestGroups(cardType: string) {
  return getCardTypeConfig(cardType)?.defaultGuestGroups ?? [];
}

export function pickPrimaryEventAt(
  events?: Array<{ startsAt?: Date | string | null; isPrimary?: boolean }>,
): Date | null {
  if (!events?.length) return null;
  const primary = events.find((e) => e.isPrimary) || events[0];
  if (!primary?.startsAt) return null;
  return new Date(primary.startsAt);
}

export function generateInvitationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function resolveGuestGroupCode(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  const byCode = getEnumByCode(enumData.GUEST_GROUP, trimmed.toUpperCase());
  if (byCode) return byCode.code;

  const aliases: Record<string, string> = {
    groom: enumData.GUEST_GROUP.GROOM.code,
    'chu re': enumData.GUEST_GROUP.GROOM.code,
    'chú rể': enumData.GUEST_GROUP.GROOM.code,
    bride: enumData.GUEST_GROUP.BRIDE.code,
    'co dau': enumData.GUEST_GROUP.BRIDE.code,
    'cô dâu': enumData.GUEST_GROUP.BRIDE.code,
    both: enumData.GUEST_GROUP.BOTH.code,
    'ca hai': enumData.GUEST_GROUP.BOTH.code,
    'cả hai': enumData.GUEST_GROUP.BOTH.code,
    family: enumData.GUEST_GROUP.FAMILY.code,
    'gia dinh': enumData.GUEST_GROUP.FAMILY.code,
    friends: enumData.GUEST_GROUP.FRIENDS.code,
    'ban be': enumData.GUEST_GROUP.FRIENDS.code,
    work: enumData.GUEST_GROUP.WORK.code,
    teachers: enumData.GUEST_GROUP.TEACHERS.code,
    paternal: enumData.GUEST_GROUP.PATERNAL.code,
    maternal: enumData.GUEST_GROUP.MATERNAL.code,
  };
  const key = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
  return aliases[key] || aliases[trimmed.toLowerCase()];
}

export function hasModule(
  enabledModules: string[] | undefined,
  moduleCode: string,
): boolean {
  return (enabledModules || []).includes(moduleCode);
}

export function assertPublishedInvitation(
  invitation: { status?: string } | null | undefined,
) {
  if (
    !invitation ||
    invitation.status !== enumData.INVITATION_STATUS.PUBLISHED.code
  ) {
    throw new NotFoundException('Không tìm thấy thiệp');
  }
}

export function assertInvitationModule(
  invitation: { enabledModules?: string[] },
  moduleCode: string,
  message = 'Thiệp này không bật chức năng này',
) {
  if (!hasModule(invitation.enabledModules, moduleCode)) {
    throw new ForbiddenException(message);
  }
}

export function toCardViewModel(invitation: any) {
  if (!invitation) return null;
  const sectionConfig = invitation.sectionConfig || defaultSectionConfig();
  const showGifts =
    sectionConfig[enumData.SECTION_FLAG.SHOW_GIFTS.code] !== false;
  const giftsEnabled = hasModule(
    invitation.enabledModules,
    enumData.INVITATION_MODULE.GIFTS.code,
  );
  return {
    id: invitation.id,
    slug: invitation.slug,
    cardType: invitation.cardType,
    title: invitation.title,
    invitationText: invitation.invitationText,
    thankYouText: invitation.thankYouText,
    hashtag: invitation.hashtag,
    heroImageUrl: invitation.heroImageUrl,
    primaryEventAt: invitation.primaryEventAt,
    sectionConfig,
    enabledModules:
      invitation.enabledModules || defaultEnabledModules(invitation.cardType),
    music: invitation.music || defaultMusicConfig(),
    extraContent: invitation.extraContent || {},
    customDesign: invitation.customDesign,
    coverConfig: invitation.coverConfig || {},
    status: invitation.status,
    hosts: invitation.hosts || [],
    events: invitation.events || [],
    timelines: invitation.timelines || [],
    photos: invitation.photos || [],
    gifts: showGifts && giftsEnabled ? invitation.gifts || [] : [],
    guestGroups: invitation.guestGroups || [],
    template: invitation.template
      ? {
          id: invitation.template.id,
          themeCode: invitation.template.themeCode,
          name: invitation.template.name,
        }
      : null,
  };
}
