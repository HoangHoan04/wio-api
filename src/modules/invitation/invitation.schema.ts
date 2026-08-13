import { enumData } from '@/common/constanst/enumData';
import { getCardTypeConfig } from '@/utils/invitation.utils';

const COMMON_EXTRA_KEYS = [
  'displayOrder',
  'loveStory',
  'partyType',
  'galleryLayout',
  'rsvpType',
  'timelineTitle',
  'dressCodes',
  'school',
  'major',
  'year',
  'age',
  'partyTheme',
];

export function extraContentKeysFor(cardType: string): string[] {
  const config = getCardTypeConfig(cardType);
  const sections: string[] = config?.wizardSections || [];
  if (!sections.includes(enumData.WIZARD_SECTION.EXTRA.code)) {
    return COMMON_EXTRA_KEYS.filter((key) => key !== 'loveStory' && key !== 'school');
  }
  return COMMON_EXTRA_KEYS;
}

export function sanitizeExtraContent(
  cardType: string,
  extra?: Record<string, any>,
): Record<string, any> {
  if (!extra) return {};
  const allowed = extraContentKeysFor(cardType);
  return Object.fromEntries(
    Object.entries(extra).filter(([key]) => allowed.includes(key)),
  );
}
