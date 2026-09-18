import { enumData } from '@/common/constanst/enumData';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getEnumByCode, isEnumCode } from './enum.utils';

/* ============================================================
 * TYPES
 * ============================================================ */
export type SectionConfig = Record<string, any>;

const LEGACY_SECTION_KEY: Record<string, string> = {
  showHero: enumData.SECTION_FLAG.SHOW_HERO.code,
  showIntro: enumData.SECTION_FLAG.SHOW_INTRO.code,
  showGallery: enumData.SECTION_FLAG.SHOW_GALLERY.code,
  showCountdown: enumData.SECTION_FLAG.SHOW_COUNTDOWN.code,
  showMap: enumData.SECTION_FLAG.SHOW_MAP.code,
  showDressCode: enumData.SECTION_FLAG.SHOW_DRESS_CODE.code,
  showTimeline: enumData.SECTION_FLAG.SHOW_TIMELINE.code,
  showRsvp: enumData.SECTION_FLAG.SHOW_RSVP.code,
  showGuestbook: enumData.SECTION_FLAG.SHOW_GUESTBOOK.code,
  showGifts: enumData.SECTION_FLAG.SHOW_GIFTS.code,
  showThankYou: enumData.SECTION_FLAG.SHOW_THANK_YOU.code,
  guestbookStatic: enumData.SECTION_FLAG.GUESTBOOK_STATIC.code,
  guestbookFloating: enumData.SECTION_FLAG.GUESTBOOK_FLOATING.code,
};

const LEGACY_EVENT_KEY: Record<string, string> = {
  CEREMONY: enumData.EVENT_KEY.WEDDING_RECEPTION.code,
  CUSTOM: enumData.EVENT_KEY.WEDDING_RECEPTION.code,
};

function readFlagEnabled(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value;
  if (value && typeof value === 'object' && 'enabled' in (value as object)) {
    return (value as { enabled?: boolean }).enabled !== false;
  }
  return fallback;
}

function readFlagOrder(value: unknown, fallback: number): number {
  if (value && typeof value === 'object' && 'order' in (value as object)) {
    const order = (value as { order?: number }).order;
    if (typeof order === 'number') return order;
  }
  return fallback;
}

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
  partyInfo: 'SHOW_PARTY',
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
    SHOW_PARTY: true,
    [flags.GUESTBOOK_STATIC.code]: true,
    [flags.GUESTBOOK_FLOATING.code]: true,
  };
}

export function normalizeSectionConfig(
  sectionConfig?: SectionConfig | null,
): SectionConfig {
  const merged: SectionConfig = { ...defaultSectionConfig() };
  if (!sectionConfig) return merged;

  for (const [rawKey, rawValue] of Object.entries(sectionConfig)) {
    if (rawKey === 'displayOrder') {
      merged.displayOrder = String(rawValue || '')
        .toUpperCase()
        .includes('BRIDE')
        ? 'BRIDE_FIRST'
        : 'GROOM_FIRST';
      continue;
    }
    if (rawKey === 'galleryLayout' || rawKey === 'GALLERY_LAYOUT') {
      merged.galleryLayout = rawValue;
      continue;
    }
    if (
      rawKey === 'rsvpType' ||
      rawKey === 'rsvpVariant' ||
      rawKey === 'RSVP_VARIANT'
    ) {
      merged.rsvpVariant = rawValue;
      continue;
    }
    const key = LEGACY_SECTION_KEY[rawKey] || rawKey;
    merged[key] = rawValue;
  }

  return merged;
}

export function normalizeEventKey(raw?: string): string {
  if (!raw) return enumData.EVENT_KEY.WEDDING_RECEPTION.code;
  const mapped = LEGACY_EVENT_KEY[raw] || raw;
  if (isEnumCode(enumData.EVENT_KEY, mapped)) return mapped;
  return enumData.EVENT_KEY.WEDDING_RECEPTION.code;
}

export function hasCanvasDesign(customDesign: unknown): boolean {
  if (!customDesign) return false;
  const parsed =
    typeof customDesign === 'string'
      ? (() => {
          try {
            return JSON.parse(customDesign);
          } catch {
            return null;
          }
        })()
      : customDesign;
  return Array.isArray((parsed as { elements?: unknown } | null)?.elements);
}

export function resolveCreatedVia(input: {
  createdVia?: string;
  designMode?: string;
  templateId?: string;
}): string {
  if (input.createdVia && isEnumCode(enumData.CREATED_VIA, input.createdVia)) {
    return input.createdVia;
  }
  if (input.designMode === enumData.DESIGN_MODE.AI_SCAN.code) {
    return enumData.CREATED_VIA.AI_SCAN.code;
  }
  if (input.designMode === enumData.DESIGN_MODE.CANVA.code) {
    return input.templateId
      ? enumData.CREATED_VIA.CANVAS_PRESET.code
      : enumData.CREATED_VIA.BLANK.code;
  }
  return enumData.CREATED_VIA.TEMPLATE.code;
}

export function resolveRuntimeDesignMode(input: {
  designMode?: string;
  customDesign?: unknown;
}): string {
  if (input.designMode === enumData.DESIGN_MODE.AI_SCAN.code) {
    return hasCanvasDesign(input.customDesign)
      ? enumData.DESIGN_MODE.CANVA.code
      : enumData.DESIGN_MODE.TEMPLATE.code;
  }
  if (
    input.designMode === enumData.DESIGN_MODE.CANVA.code ||
    input.designMode === enumData.DESIGN_MODE.TEMPLATE.code
  ) {
    return input.designMode;
  }
  return hasCanvasDesign(input.customDesign)
    ? enumData.DESIGN_MODE.CANVA.code
    : enumData.DESIGN_MODE.TEMPLATE.code;
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
function sanitizeLayoutOrder(themeLayout?: Record<string, any> | null): string[] {
  const raw = themeLayout?.sectionOrder;
  if (!Array.isArray(raw) || !raw.length) return defaultSectionOrder();
  const allowed = new Set(DEFAULT_SECTION_ORDER);
  const seen = new Set<string>();
  const order: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string' || !allowed.has(item) || seen.has(item)) continue;
    seen.add(item);
    order.push(item);
  }
  return order.length ? order : defaultSectionOrder();
}

export function resolveSectionConfig(
  sectionConfig?: SectionConfig | null,
  themeLayout?: Record<string, any> | null,
): {
  sectionOrder: string[];
  sectionConfig: SectionConfig;
} {
  const mergedConfig = normalizeSectionConfig(sectionConfig);
  const baseOrder = sanitizeLayoutOrder(themeLayout);
  const hasCustomOrder = baseOrder.some((id) => {
    const flag = SECTION_FLAG_MAP[id];
    return flag && typeof mergedConfig[flag] === 'object' && mergedConfig[flag] !== null;
  });
  const ordered = hasCustomOrder
    ? [...baseOrder].sort((a, b) => {
        const flagA = SECTION_FLAG_MAP[a];
        const flagB = SECTION_FLAG_MAP[b];
        const orderA = flagA
          ? readFlagOrder(mergedConfig[flagA], baseOrder.indexOf(a))
          : baseOrder.indexOf(a);
        const orderB = flagB
          ? readFlagOrder(mergedConfig[flagB], baseOrder.indexOf(b))
          : baseOrder.indexOf(b);
        return orderA - orderB;
      })
    : baseOrder;

  const sectionOrder = ordered.filter((id) => {
    const flag = SECTION_FLAG_MAP[id];
    if (!flag) return true;
    return readFlagEnabled(mergedConfig[flag], true);
  });

  return {
    sectionOrder,
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
    return;
  }

  const merged = normalizeSectionConfig(invitation.sectionConfig);

  if (readFlagEnabled(merged[sectionFlag], false) !== true) {
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
  const merged = normalizeSectionConfig(sectionConfig);
  return readFlagEnabled(merged[sectionFlag], false) === true;
}

/* ============================================================
 * VIEW MODEL — Trả về thiệp cưới cho FE
 * ============================================================ */
export function toCardViewModel(invitation: any) {
  if (!invitation) return null;

  const snapshot = invitation.themeSnapshot || {};
  const template = invitation.template;
  const { sectionOrder, sectionConfig } = resolveSectionConfig(
    invitation.sectionConfig,
    snapshot.themeLayout || template?.themeLayout,
  );
  const music = invitation.music;
  const customDesign = hasCanvasDesign(invitation.customDesign)
    ? invitation.customDesign
    : invitation.designMode === enumData.DESIGN_MODE.CANVA.code
      ? invitation.customDesign
      : null;

  return {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    status: invitation.status,
    designMode: resolveRuntimeDesignMode(invitation),
    createdVia: invitation.createdVia,
    weddingTheme: invitation.weddingTheme,
    invitationText: invitation.invitationText,
    thankYouText: invitation.thankYouText,
    hashtag: invitation.weddingInfo?.hashtag || invitation.hashtag || null,
    heroImageUrl: invitation.heroImageUrl,
    primaryEventAt: invitation.primaryEventAt,
    sectionOrder,
    sectionConfig,
    musicId: invitation.musicId,
    musicConfig: invitation.musicConfig || defaultMusicConfig(),
    music: music
      ? {
          id: music.id,
          name: music.name,
          author: music.author,
          audioUrl: music.audioUrl,
          youtubeUrl: music.youtubeUrl,
          type: music.type,
          thumbnailUrl: music.thumbnailUrl,
        }
      : null,
    customDesign,
    designSchemaVersion: invitation.designSchemaVersion ?? 1,
    themeSnapshot: invitation.themeSnapshot || null,
    aiGeneratedMeta: invitation.aiGeneratedMeta || null,
    weddingInfo: invitation.weddingInfo || null,
    hosts: invitation.hosts || [],
    events: invitation.events || [],
    timelines: invitation.timelines || [],
    photos: invitation.photos || [],
    gifts: invitation.gifts || [],
    guestGroups: invitation.guestGroups || [],
    template: template
      ? {
          id: template.id,
          themeCode: template.themeCode,
          name: template.name,
          slug: template.slug,
          weddingTheme: template.weddingTheme,
          kind: template.kind,
          themeLayout: snapshot.themeLayout || template.themeLayout,
          presetTokens: snapshot.presetTokens || template.presetTokens,
        }
      : snapshot.themeCode
        ? {
            themeCode: snapshot.themeCode,
            themeLayout: snapshot.themeLayout,
            presetTokens: snapshot.presetTokens,
          }
        : null,
    shareUrl: invitation.shareUrl,
    shareQrUrl: invitation.shareQrUrl,
    viewCount: invitation.viewCount,
    uniqueViewCount: invitation.uniqueViewCount,
  };
}
