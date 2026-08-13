import { enumData } from '@/common/constanst/enumData';
import { getEnumByCode } from './enum.utils';

export type SectionConfig = Record<string, boolean>;

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
