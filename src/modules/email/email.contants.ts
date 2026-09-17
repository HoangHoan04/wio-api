/**
 * Hằng số cấu hình thương hiệu InviGo
 * Có thể override qua ENV nếu cần
 */
export const EMAIL_BRAND = {
  NAME: process.env.BRAND_NAME || 'InviGo',
  TAGLINE: process.env.BRAND_TAGLINE || 'Thiệp cưới online',
  WEBSITE: process.env.BRAND_WEBSITE || 'https://invigo.vn',
  HOTLINE: process.env.BRAND_HOTLINE || '1900 123 456',
  SUPPORT_EMAIL: process.env.BRAND_SUPPORT_EMAIL || 'hello@invigo.vn',
  COMPANY_NAME:
    process.env.BRAND_COMPANY_NAME || 'HỆ THỐNG THIỆP CƯỚI TRỰC TUYẾN — INVIGO',
} as const;

/** Màu chủ đạo của InviGo (dùng cho email template) */
export const EMAIL_COLORS = {
  BG_DARK: '#1a0a0f',
  BG_CARD: '#251218',
  GOLD: '#f5c842',
  GOLD_MUTED: '#d4af37',
  TEXT: '#f5e6d3',
} as const;
