import { enumData } from '@/common/constanst/enumData';

export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,58}[a-z0-9]$/;

export const RESERVED_SLUGS = [
  'manage',
  'admin',
  'api',
  'login',
  'register',
  'pricing',
  'logout',
  'thiep',
  'wio',
  'mau-thiep',
  'bang-gia',
];

export function slugify(text: string): string {
  const slug = (text || 'thiep')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'thiep';
}

export function ensureSlug(slug?: string, title?: string): string {
  if (slug && isValidSlugFormat(slug) && !isReservedSlug(slug)) return slug;
  const base = slugify(title || slug || 'thiep');
  return `${base}-${Date.now().toString(36)}`;
}

export function isValidSlugFormat(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

export function buildShareUrl(slug: string): string {
  const customerUrl =
    process.env.CUSTOMER_URL ||
    process.env.GOOGLE_FRONTEND_REDIRECT_URL ||
    'http://localhost:2504';
  return `${customerUrl.replace(/\/$/, '')}/thiep/${slug}`;
}

export function invitationStatusesBlockingSlug(): string[] {
  return [
    enumData.INVITATION_STATUS.DRAFT.code,
    enumData.INVITATION_STATUS.PUBLISHED.code,
  ];
}
