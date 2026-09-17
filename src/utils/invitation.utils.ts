import { enumData } from '@/common/constanst/enumData';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getEnumByCode } from './enum.utils';

/* ============================================================
 * TYPES
 * ============================================================ */
export type SectionConfig = Record<string, boolean>;

/* ============================================================
 * SECTION ORDER — thứ tự mặc định các section trên thiệp cưới
 * ============================================================ */
const DEFAULT_SECTION_ORDER: string[] = [
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

/**
 * Mapping section ID (frontend key) → SECTION_FLAG code
 * Dùng để biết section nào đang bật/tắt trong sectionConfig.
 */
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

/**
 * Mapping INVITATION_MODULE code → SECTION_FLAG code
 * Dùng cho assertInvitationModule()
 */
const MODULE_TO_SECTION_FLAG: Record<string, string> = {
  [enumData.INVITATION_MODULE.RSVP.code]: enumData.SECTION_FLAG.SHOW_RSVP.code,
  [enumData.INVITATION_MODULE.GUESTBOOK.code]:
    enumData.SECTION_FLAG.SHOW_GUESTBOOK.code,
  [enumData.INVITATION_MODULE.GIFTS.code]:
    enumData.SECTION_FLAG.SHOW_GIFTS.code,
  [enumData.INVITATION_MODULE.GALLERY.code]:
    enumData.SECTION_FLAG.SHOW_GALLERY.code,
  [enumData.INVITATION_MODULE.MAP.code]: enumData.SECTION_FLAG.SHOW_MAP.code,
  [enumData.INVITATION_MODULE.COUNTDOWN.code]:
    enumData.SECTION_FLAG.SHOW_COUNTDOWN.code,
  [enumData.INVITATION_MODULE.DRESS_CODE.code]:
    enumData.SECTION_FLAG.SHOW_DRESS_CODE.code,
  [enumData.INVITATION_MODULE.TIMELINE.code]:
    enumData.SECTION_FLAG.SHOW_TIMELINE.code,
  [enumData.INVITATION_MODULE.PHOTO_WALL.code]:
    enumData.SECTION_FLAG.SHOW_GALLERY.code,
};

/* ============================================================
 * DEFAULT CONFIGS
 * ============================================================ */
export function defaultSectionOrder(): string[] {
  return [...DEFAULT_SECTION_ORDER];
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

export function defaultMusicConfig(): {
  autoplay: boolean;
  loop: boolean;
  volume: number;
} {
  return {
    autoplay: false,
    loop: true,
    volume: 0.7,
  };
}

/* ============================================================
 * RESOLVE SECTION
 * ============================================================ */
/**
 * Trộn sectionConfig của user với default, trả về:
 *  - sectionOrder: thứ tự hiển thị các section
 *  - sectionConfig: cấu hình đã merge
 */
export function resolveSectionConfig(sectionConfig?: SectionConfig | null): {
  sectionOrder: string[];
  sectionConfig: SectionConfig;
} {
  const mergedConfig: SectionConfig = {
    ...defaultSectionConfig(),
    ...(sectionConfig || {}),
  };

  return {
    sectionOrder: defaultSectionOrder(),
    sectionConfig: mergedConfig,
  };
}

/* ============================================================
 * GET CONFIG BY CODE
 * ============================================================ */
export function getWeddingThemeConfig(weddingTheme: string) {
  return getEnumByCode(enumData.WEDDING_THEME, weddingTheme);
}

export function getDesignModeConfig(designMode: string) {
  return getEnumByCode(enumData.DESIGN_MODE, designMode);
}

/* ============================================================
 * PRIMARY EVENT
 * ============================================================ */
export function pickPrimaryEventAt(
  events?: Array<{ startsAt?: Date | string | null; isPrimary?: boolean }>,
): Date | null {
  if (!events?.length) return null;
  const primary = events.find((e) => e.isPrimary) || events[0];
  if (!primary?.startsAt) return null;
  return new Date(primary.startsAt);
}

/* ============================================================
 * GENERATE CODE
 * ============================================================ */
export function generateInvitationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* ============================================================
 * GUEST GROUP CODE RESOLUTION
 * ============================================================ */
export function resolveGuestGroupCode(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();

  // Thử tìm theo enum code trước
  const byCode = getEnumByCode(enumData.GUEST_GROUP, trimmed.toUpperCase());
  if (byCode) return byCode.code;

  // Fallback alias tiếng Việt
  const aliases: Record<string, string> = {
    'chu re': enumData.GUEST_GROUP.FAMILY.code,
    'co dau': enumData.GUEST_GROUP.FAMILY.code,
    'ca hai': enumData.GUEST_GROUP.OTHER.code,
    'gia dinh': enumData.GUEST_GROUP.FAMILY.code,
    'ban be': enumData.GUEST_GROUP.FRIENDS.code,
    'dong nghiep': enumData.GUEST_GROUP.COLLEAGUES.code,
    'thay co': enumData.GUEST_GROUP.TEACHERS.code,
    'ben noi': enumData.GUEST_GROUP.PATERNAL.code,
    'ben ngoai': enumData.GUEST_GROUP.MATERNAL.code,
    'hang xom': enumData.GUEST_GROUP.NEIGHBORS.code,
  };

  const key = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

  return aliases[key] || aliases[trimmed.toLowerCase()];
}

/* ============================================================
 * ASSERT HELPERS
 * ============================================================ */
export function assertPublishedInvitation(
  invitation: { status?: string } | null | undefined,
): void {
  if (
    !invitation ||
    invitation.status !== enumData.INVITATION_STATUS.PUBLISHED.code
  ) {
    throw new NotFoundException('Không tìm thấy thiệp');
  }
}

/**
 * Kiểm tra module đã bật trong sectionConfig
 * VD: RSVP → SHOW_RSVP = true
 */
export function assertInvitationModule(
  invitation: { sectionConfig?: SectionConfig } | null | undefined,
  moduleCode: string,
  message = 'Thiệp này không bật chức năng này',
): void {
  if (!invitation) {
    throw new NotFoundException('Không tìm thấy thiệp');
  }

  const sectionFlag = MODULE_TO_SECTION_FLAG[moduleCode];
  if (!sectionFlag) {
    throw new ForbiddenException('Module không hợp lệ');
  }

  const merged = {
    ...defaultSectionConfig(),
    ...(invitation.sectionConfig || {}),
  };

  if (merged[sectionFlag] !== true) {
    throw new ForbiddenException(message);
  }
}

/**
 * Kiểm tra 1 section có đang bật trong sectionConfig hay không
 */
export function hasSection(
  sectionConfig: SectionConfig | undefined,
  sectionFlag: string,
): boolean {
  const merged = { ...defaultSectionConfig(), ...(sectionConfig || {}) };
  return merged[sectionFlag] === true;
}

/* ============================================================
 * VIEW MODEL — Trả về thiệp cưới cho FE
 * ============================================================ */
export function toCardViewModel(invitation: any) {
  if (!invitation) return null;

  const { sectionOrder, sectionConfig } = resolveSectionConfig(
    invitation.sectionConfig,
  );

  return {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,

    // Phân loại
    designMode: invitation.designMode,
    weddingTheme: invitation.weddingTheme,

    // Nội dung hiển thị
    invitationText: invitation.invitationText,
    thankYouText: invitation.thankYouText,
    hashtag: invitation.hashtag,
    heroImageUrl: invitation.heroImageUrl,
    primaryEventAt: invitation.primaryEventAt,

    // Cấu hình
    sectionOrder,
    sectionConfig,

    // Nhạc nền
    musicId: invitation.musicId,
    musicConfig: invitation.musicConfig || defaultMusicConfig(),

    // Design (chỉ CANVA mới có)
    customDesign:
      invitation.designMode === enumData.DESIGN_MODE.CANVA.code
        ? invitation.customDesign
        : null,

    // AI meta (chỉ AI_SCAN mới có)
    aiGeneratedMeta:
      invitation.designMode === enumData.DESIGN_MODE.AI_SCAN.code
        ? invitation.aiGeneratedMeta
        : null,

    // Trạng thái
    status: invitation.status,

    // Quan hệ
    hosts: invitation.hosts || [],
    events: invitation.events || [],
    timelines: invitation.timelines || [],
    photos: invitation.photos || [],
    gifts: invitation.gifts || [],
    guestGroups: invitation.guestGroups || [],

    // Template
    template: invitation.template
      ? {
          id: invitation.template.id,
          themeCode: invitation.template.themeCode,
          name: invitation.template.name,
        }
      : null,
  };
}
