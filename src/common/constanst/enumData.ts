/**
 * Trung tâm quản lý toàn bộ enum của dự án Thiệp Cưới Online.
 */
export const enumData = {
  /* ============================================================
   * 1. NGƯỜI DÙNG & PHÂN QUYỀN
   * ============================================================ */
  USER_ROLE: {
    CUSTOMER: { code: 'CUSTOMER', name: 'Khách hàng', color: '#3B82F6' },
    ADMIN: { code: 'ADMIN', name: 'Quản trị viên', color: '#DC2626' },
  },

  USER_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động', color: '#16A34A' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động', color: '#94A3B8' },
    BANNED: { code: 'BANNED', name: 'Bị khóa', color: '#DC2626' },
    PENDING_VERIFY: {
      code: 'PENDING_VERIFY',
      name: 'Chờ xác thực',
      color: '#F59E0B',
    },
  },

  /* ============================================================
   * 2. ACTION LOG (Audit)
   * ============================================================ */
  ACTION_TYPE: {
    CREATE: { code: 'CREATE', name: 'Thêm mới', color: '#16A34A' },
    UPDATE: { code: 'UPDATE', name: 'Cập nhật', color: '#2563EB' },
    DELETE: { code: 'DELETE', name: 'Xoá bỏ', color: '#DC2626' },
    RESTORE: { code: 'RESTORE', name: 'Khôi phục', color: '#4F46E5' },
    EDIT: { code: 'EDIT', name: 'Chỉnh sửa', color: '#EA580C' },
    SYNC: { code: 'SYNC', name: 'Đồng bộ', color: '#CA8A04' },
    APPROVE: { code: 'APPROVE', name: 'Duyệt', color: '#059669' },
    REJECT: { code: 'REJECT', name: 'Từ chối', color: '#E11D48' },
    SEND_APPROVE: { code: 'SEND_APPROVE', name: 'Gửi duyệt', color: '#0284C7' },
    CANCEL: { code: 'CANCEL', name: 'Huỷ', color: '#64748B' },
    ACTIVATE: { code: 'ACTIVATE', name: 'Kích hoạt', color: '#10B981' },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      name: 'Ngưng hoạt động',
      color: '#94A3B8',
    },
    PUBLISH: { code: 'PUBLISH', name: 'Xuất bản', color: '#15803D' },
    UNPUBLISH: { code: 'UNPUBLISH', name: 'Hủy xuất bản', color: '#B91C1C' },
    IMPORT_EXCEL: {
      code: 'IMPORT_EXCEL',
      name: 'Nhập Excel',
      color: '#0D9488',
    },
    UPLOAD_FILE: {
      code: 'UPLOAD_FILE',
      name: 'Tải file lên',
      color: '#0891B2',
    },
    LOGIN: { code: 'LOGIN', name: 'Đăng nhập', color: '#3B82F6' },
    LOGOUT: { code: 'LOGOUT', name: 'Đăng xuất', color: '#6B7280' },
    REGISTER: { code: 'REGISTER', name: 'Đăng ký', color: '#8B5CF6' },
    AWARD: { code: 'AWARD', name: 'Trao thưởng', color: '#D97706' },
  },

  /* ============================================================
   * 3. THIỆP CƯỚI — PHÂN LOẠI & TRẠNG THÁI
   * ============================================================ */
  DESIGN_MODE: {
    CANVA: { code: 'CANVA', name: 'Tự thiết kế (Canva)', color: '#8B5CF6' },
    TEMPLATE: { code: 'TEMPLATE', name: 'Dùng thiệp mẫu', color: '#0EA5E9' },
    AI_SCAN: { code: 'AI_SCAN', name: 'AI quét ảnh', color: '#F59E0B' },
  },

  CREATED_VIA: {
    BLANK: { code: 'BLANK', name: 'Tự thiết kế trống', color: '#8B5CF6' },
    TEMPLATE: { code: 'TEMPLATE', name: 'Từ thiệp mẫu', color: '#0EA5E9' },
    CANVAS_PRESET: {
      code: 'CANVAS_PRESET',
      name: 'Từ preset Canva',
      color: '#6366F1',
    },
    AI_SCAN: { code: 'AI_SCAN', name: 'AI quét ảnh', color: '#F59E0B' },
  },

  TEMPLATE_KIND: {
    CODE_THEME: { code: 'CODE_THEME', name: 'Theme React', color: '#0EA5E9' },
    CANVAS_PRESET: {
      code: 'CANVAS_PRESET',
      name: 'Preset Canva',
      color: '#8B5CF6',
    },
  },

  INVITATION_STATUS: {
    DRAFT: { code: 'DRAFT', name: 'Bản nháp', color: '#94A3B8' },
    PUBLISHED: { code: 'PUBLISHED', name: 'Đã xuất bản', color: '#16A34A' },
    ARCHIVED: { code: 'ARCHIVED', name: 'Đã lưu trữ', color: '#2563EB' },
    EXPIRED: { code: 'EXPIRED', name: 'Đã hết hạn', color: '#DC2626' },
  },

  WEDDING_THEME: {
    CLASSIC: { code: 'CLASSIC', name: 'Cổ điển', color: '#B45309' },
    MODERN: { code: 'MODERN', name: 'Hiện đại', color: '#0EA5E9' },
    MINIMAL: { code: 'MINIMAL', name: 'Tối giản', color: '#64748B' },
    LUXURY: { code: 'LUXURY', name: 'Sang trọng', color: '#CA8A04' },
    VINTAGE: { code: 'VINTAGE', name: 'Cổ điển xưa', color: '#92400E' },
    FLORAL: { code: 'FLORAL', name: 'Hoa lá', color: '#EC4899' },
    TRADITIONAL: {
      code: 'TRADITIONAL',
      name: 'Truyền thống',
      color: '#B91C1C',
    },
    BEACH: { code: 'BEACH', name: 'Biển', color: '#06B6D4' },
    RUSTIC: { code: 'RUSTIC', name: 'Mộc mạc', color: '#A16207' },
  },

  THEME_CODE: {
    AUTUMN_BLOOM: { code: 'AUTUMN_BLOOM', name: 'Autumn Bloom' },
    BLUSH_GARDEN: { code: 'BLUSH_GARDEN', name: 'Blush Garden' },
    CRIMSON_BAROQUE: { code: 'CRIMSON_BAROQUE', name: 'Crimson Baroque' },
    DRAGON_BLESSING: { code: 'DRAGON_BLESSING', name: 'Dragon Blessing' },
    EMERALD_STORY: { code: 'EMERALD_STORY', name: 'Emerald Story' },
    EMERALD_UNION: { code: 'EMERALD_UNION', name: 'Emerald Union' },
    GOLDEN_PHOENIX: { code: 'GOLDEN_PHOENIX', name: 'Golden Phoenix' },
    IVORY_BLOSSOM: { code: 'IVORY_BLOSSOM', name: 'Ivory Blossom' },
    PHOENIX_PAIR: { code: 'PHOENIX_PAIR', name: 'Phoenix Pair' },
    REGAL_CRIMSON: { code: 'REGAL_CRIMSON', name: 'Regal Crimson' },
    REGAL_UNION: { code: 'REGAL_UNION', name: 'Regal Union' },
    ROSY_BLOOM: { code: 'ROSY_BLOOM', name: 'Rosy Bloom' },
    RUBY_ENVELOPE: { code: 'RUBY_ENVELOPE', name: 'Ruby Envelope' },
    SCARLET_UNION: { code: 'SCARLET_UNION', name: 'Scarlet Union' },
    SPRING_BLOOM: { code: 'SPRING_BLOOM', name: 'Spring Bloom' },
    TWIN_PHOENIX: { code: 'TWIN_PHOENIX', name: 'Twin Phoenix' },
    VINTAGE_MINIMAL: { code: 'VINTAGE_MINIMAL', name: 'Vintage Minimal' },
  },

  INVITATION_MODULE: {
    RSVP: { code: 'RSVP', name: 'Xác nhận tham dự', color: '#16A34A' },
    GUESTBOOK: { code: 'GUESTBOOK', name: 'Sổ lời chúc', color: '#8B5CF6' },
    GIFTS: { code: 'GIFTS', name: 'Quà / chuyển khoản', color: '#EC4899' },
    SEATING: { code: 'SEATING', name: 'Sơ đồ bàn', color: '#0EA5E9' },
    PHOTO_WALL: { code: 'PHOTO_WALL', name: 'Tường ảnh', color: '#F59E0B' },
    GALLERY: { code: 'GALLERY', name: 'Album ảnh', color: '#8B5CF6' },
    MAP: { code: 'MAP', name: 'Bản đồ', color: '#EF4444' },
    COUNTDOWN: { code: 'COUNTDOWN', name: 'Đếm ngược', color: '#DC2626' },
    MUSIC: { code: 'MUSIC', name: 'Nhạc nền', color: '#6366F1' },
    DRESS_CODE: { code: 'DRESS_CODE', name: 'Dress code', color: '#14B8A6' },
    TIMELINE: { code: 'TIMELINE', name: 'Lịch trình', color: '#0891B2' },
  },

  SECTION_FLAG: {
    SHOW_HERO: { code: 'SHOW_HERO', name: 'Ảnh cover', color: '#0EA5E9' },
    SHOW_INTRO: { code: 'SHOW_INTRO', name: 'Giới thiệu', color: '#8B5CF6' },
    SHOW_GALLERY: { code: 'SHOW_GALLERY', name: 'Album ảnh', color: '#EC4899' },
    SHOW_COUNTDOWN: {
      code: 'SHOW_COUNTDOWN',
      name: 'Đếm ngược',
      color: '#DC2626',
    },
    SHOW_MAP: { code: 'SHOW_MAP', name: 'Bản đồ', color: '#EF4444' },
    SHOW_DRESS_CODE: {
      code: 'SHOW_DRESS_CODE',
      name: 'Dress code',
      color: '#14B8A6',
    },
    SHOW_TIMELINE: {
      code: 'SHOW_TIMELINE',
      name: 'Lịch trình',
      color: '#0891B2',
    },
    SHOW_RSVP: { code: 'SHOW_RSVP', name: 'RSVP', color: '#16A34A' },
    SHOW_GUESTBOOK: {
      code: 'SHOW_GUESTBOOK',
      name: 'Sổ lời chúc',
      color: '#8B5CF6',
    },
    SHOW_GIFTS: { code: 'SHOW_GIFTS', name: 'Quà', color: '#EC4899' },
    SHOW_THANK_YOU: {
      code: 'SHOW_THANK_YOU',
      name: 'Lời cảm ơn',
      color: '#F59E0B',
    },
    GUESTBOOK_STATIC: {
      code: 'GUESTBOOK_STATIC',
      name: 'Lời chúc tĩnh',
      color: '#64748B',
    },
    GUESTBOOK_FLOATING: {
      code: 'GUESTBOOK_FLOATING',
      name: 'Lời chúc nổi',
      color: '#6366F1',
    },
  },

  /* ============================================================
   * 4. CẶP ĐÔI — HOST / EVENT / PHOTO
   * ============================================================ */
  HOST_ROLE: {
    BRIDE: { code: 'BRIDE', name: 'Cô dâu', color: '#EC4899' },
    GROOM: { code: 'GROOM', name: 'Chú rể', color: '#3B82F6' },
    BRIDE_FATHER: { code: 'BRIDE_FATHER', name: 'Bố cô dâu', color: '#F472B6' },
    BRIDE_MOTHER: { code: 'BRIDE_MOTHER', name: 'Mẹ cô dâu', color: '#F9A8D4' },
    GROOM_FATHER: { code: 'GROOM_FATHER', name: 'Bố chú rể', color: '#60A5FA' },
    GROOM_MOTHER: { code: 'GROOM_MOTHER', name: 'Mẹ chú rể', color: '#93C5FD' },
    BRIDESMAID: { code: 'BRIDESMAID', name: 'Phù dâu', color: '#FBCFE8' },
    GROOMSMAN: { code: 'GROOMSMAN', name: 'Phù rể', color: '#BFDBFE' },
    MAID_OF_HONOR: {
      code: 'MAID_OF_HONOR',
      name: 'Phù dâu chính',
      color: '#DB2777',
    },
    BEST_MAN: { code: 'BEST_MAN', name: 'Phù rể chính', color: '#1D4ED8' },
  },

  GUEST_SIDE: {
    BRIDE: { code: 'BRIDE', name: 'Bên cô dâu', color: '#EC4899' },
    GROOM: { code: 'GROOM', name: 'Bên chú rể', color: '#3B82F6' },
    BOTH: { code: 'BOTH', name: 'Cả hai bên', color: '#8B5CF6' },
  },

  EVENT_KEY: {
    BRIDE_CEREMONY: {
      code: 'BRIDE_CEREMONY',
      name: 'Lễ vu quy (nhà gái)',
      color: '#EC4899',
    },
    GROOM_CEREMONY: {
      code: 'GROOM_CEREMONY',
      name: 'Lễ thành hôn (nhà trai)',
      color: '#3B82F6',
    },
    ENGAGEMENT: { code: 'ENGAGEMENT', name: 'Lễ đính hôn', color: '#F59E0B' },
    BETROTHAL: { code: 'BETROTHAL', name: 'Lễ ăn hỏi', color: '#F97316' },
    WEDDING_RECEPTION: {
      code: 'WEDDING_RECEPTION',
      name: 'Tiệc cưới',
      color: '#8B5CF6',
    },
    WEDDING_ANNIVERSARY: {
      code: 'WEDDING_ANNIVERSARY',
      name: 'Tiệc báo hỷ',
      color: '#10B981',
    },
  },

  PHOTO_KIND: {
    HERO: { code: 'HERO', name: 'Ảnh cover', color: '#0EA5E9' },
    GALLERY: { code: 'GALLERY', name: 'Album ảnh', color: '#8B5CF6' },
    STORY: { code: 'STORY', name: 'Ảnh câu chuyện', color: '#EC4899' },
    PRE_WEDDING: {
      code: 'PRE_WEDDING',
      name: 'Ảnh pre-wedding',
      color: '#F59E0B',
    },
    WEDDING_DAY: {
      code: 'WEDDING_DAY',
      name: 'Ảnh ngày cưới',
      color: '#16A34A',
    },
  },

  /* ============================================================
   * 5. KHÁCH MỜI — NHÓM / RSVP / BÀN
   * ============================================================ */
  GUEST_GROUP: {
    FAMILY: { code: 'FAMILY', name: 'Gia đình', color: '#EC4899' },
    FRIENDS: { code: 'FRIENDS', name: 'Bạn bè', color: '#3B82F6' },
    COLLEAGUES: { code: 'COLLEAGUES', name: 'Đồng nghiệp', color: '#8B5CF6' },
    TEACHERS: { code: 'TEACHERS', name: 'Thầy cô', color: '#F59E0B' },
    PATERNAL: { code: 'PATERNAL', name: 'Bên nội', color: '#DC2626' },
    MATERNAL: { code: 'MATERNAL', name: 'Bên ngoại', color: '#0891B2' },
    NEIGHBORS: { code: 'NEIGHBORS', name: 'Hàng xóm', color: '#10B981' },
    OTHER: { code: 'OTHER', name: 'Khác', color: '#64748B' },
  },

  RSVP_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chưa phản hồi', color: '#94A3B8' },
    ATTENDING: { code: 'ATTENDING', name: 'Tham dự', color: '#16A34A' },
    NOT_ATTENDING: {
      code: 'NOT_ATTENDING',
      name: 'Không tham dự',
      color: '#DC2626',
    },
    DECLINED: { code: 'DECLINED', name: 'Từ chối', color: '#B91C1C' },
    MAYBE: { code: 'MAYBE', name: 'Có thể', color: '#F59E0B' },
  },

  TABLE_SHAPE: {
    ROUND: { code: 'ROUND', name: 'Bàn tròn', color: '#8B5CF6' },
    SQUARE: { code: 'SQUARE', name: 'Bàn vuông', color: '#0EA5E9' },
    RECTANGLE: { code: 'RECTANGLE', name: 'Bàn chữ nhật', color: '#F59E0B' },
  },

  /* ============================================================
   * 6. AI SCAN
   * ============================================================ */
  AI_SCAN_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý', color: '#94A3B8' },
    PROCESSING: { code: 'PROCESSING', name: 'Đang xử lý', color: '#F59E0B' },
    NEEDS_REVIEW: {
      code: 'NEEDS_REVIEW',
      name: 'Cần rà soát',
      color: '#F97316',
    },
    COMPLETED: { code: 'COMPLETED', name: 'Hoàn thành', color: '#16A34A' },
    APPLIED: { code: 'APPLIED', name: 'Đã áp dụng', color: '#0EA5E9' },
    FAILED: { code: 'FAILED', name: 'Thất bại', color: '#DC2626' },
  },

  AI_PROVIDER: {
    OPENAI: { code: 'OPENAI', name: 'OpenAI', color: '#10B981' },
    GEMINI: { code: 'GEMINI', name: 'Google Gemini', color: '#3B82F6' },
    INTERNAL: { code: 'INTERNAL', name: 'Nội bộ', color: '#8B5CF6' },
  },

  /* ============================================================
   * 7. TEMPLATE & STOCK ASSET
   * ============================================================ */
  TEMPLATE_STATUS: {
    DRAFT: { code: 'DRAFT', name: 'Nháp', color: '#94A3B8' },
    ACTIVE: { code: 'ACTIVE', name: 'Đang hiển thị', color: '#16A34A' },
    HIDDEN: { code: 'HIDDEN', name: 'Đã ẩn', color: '#64748B' },
  },

  STOCK_ASSET_KIND: {
    STICKER: { code: 'STICKER', name: 'Sticker', color: '#EC4899' },
    FRAME: { code: 'FRAME', name: 'Khung ảnh', color: '#F59E0B' },
    BACKGROUND: { code: 'BACKGROUND', name: 'Nền', color: '#3B82F6' },
    ICON: { code: 'ICON', name: 'Biểu tượng', color: '#8B5CF6' },
    DECORATION: { code: 'DECORATION', name: 'Trang trí', color: '#10B981' },
  },

  STOCK_ASSET_CATEGORY: {
    HEARTS: { code: 'HEARTS', name: 'Trái tim', color: '#EF4444' },
    FLOWERS: { code: 'FLOWERS', name: 'Hoa', color: '#EC4899' },
    WEDDING: { code: 'WEDDING', name: 'Cưới', color: '#8B5CF6' },
    NATURE: { code: 'NATURE', name: 'Thiên nhiên', color: '#16A34A' },
    STARS: { code: 'STARS', name: 'Sao & lấp lánh', color: '#F59E0B' },
    ORNAMENT: { code: 'ORNAMENT', name: 'Họa tiết', color: '#64748B' },
    BACKGROUND: { code: 'BACKGROUND', name: 'Nền', color: '#0EA5E9' },
  },

  /* ============================================================
   * 8. NHẠC NỀN
   * ============================================================ */
  MUSIC_TYPE: {
    ADMIN: { code: 'ADMIN', name: 'Admin tải lên', color: '#8B5CF6' },
    USER: { code: 'USER', name: 'Người dùng tải lên', color: '#0EA5E9' },
    YOUTUBE: { code: 'YOUTUBE', name: 'YouTube', color: '#DC2626' },
    SPOTIFY: { code: 'SPOTIFY', name: 'Spotify', color: '#16A34A' },
    UPLOAD: { code: 'UPLOAD', name: 'Tải lên', color: '#F59E0B' },
  },

  MUSIC_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý', color: '#94A3B8' },
    PROCESSING: { code: 'PROCESSING', name: 'Đang xử lý', color: '#F59E0B' },
    READY: { code: 'READY', name: 'Sẵn sàng', color: '#16A34A' },
    COMPLETED: { code: 'COMPLETED', name: 'Hoàn tất', color: '#16A34A' },
    FAILED: { code: 'FAILED', name: 'Thất bại', color: '#DC2626' },
  },

  /* ============================================================
   * 9. THÔNG BÁO
   * ============================================================ */
  NOTIF_CHANNEL: {
    EMAIL: { code: 'EMAIL', name: 'Email', color: '#0EA5E9' },
    SMS: { code: 'SMS', name: 'SMS', color: '#F59E0B' },
    PUSH: { code: 'PUSH', name: 'Push', color: '#8B5CF6' },
    ZALO: { code: 'ZALO', name: 'Zalo', color: '#3B82F6' },
  },

  NOTIF_TYPE: {
    INVITE: { code: 'INVITE', name: 'Lời mời', color: '#8B5CF6' },
    REMINDER: { code: 'REMINDER', name: 'Nhắc nhở', color: '#F59E0B' },
    THANK_YOU: { code: 'THANK_YOU', name: 'Cảm ơn', color: '#16A34A' },
    RSVP_CONFIRM: {
      code: 'RSVP_CONFIRM',
      name: 'Xác nhận RSVP',
      color: '#0EA5E9',
    },
  },

  NOTIF_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ gửi', color: '#94A3B8' },
    SENT: { code: 'SENT', name: 'Đã gửi', color: '#16A34A' },
    FAILED: { code: 'FAILED', name: 'Gửi thất bại', color: '#DC2626' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: '#64748B' },
  },

  /* ============================================================
   * 10. THANH TOÁN & GÓI DỊCH VỤ
   * ============================================================ */
  SUB_STATUS: {
    TRIAL: { code: 'TRIAL', name: 'Dùng thử', color: '#F59E0B' },
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động', color: '#16A34A' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hạn', color: '#DC2626' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: '#64748B' },
  },

  SERVICE_PLAN_CODE: {
    FREE: { code: 'FREE', name: 'Miễn phí', color: '#64748B' },
    BASIC: { code: 'BASIC', name: 'Cơ bản', color: '#0EA5E9' },
    PRO: { code: 'PRO', name: 'Chuyên nghiệp', color: '#8B5CF6' },
    PREMIUM: { code: 'PREMIUM', name: 'Cao cấp', color: '#F59E0B' },
  },

  TX_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ thanh toán', color: '#F59E0B' },
    PAID: { code: 'PAID', name: 'Đã thanh toán', color: '#16A34A' },
    SUCCESS: { code: 'SUCCESS', name: 'Thành công', color: '#16A34A' },
    FAILED: { code: 'FAILED', name: 'Thất bại', color: '#DC2626' },
    REFUNDED: { code: 'REFUNDED', name: 'Đã hoàn tiền', color: '#0EA5E9' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: '#64748B' },
  },

  TX_METHOD: {
    VNPAY: { code: 'VNPAY', name: 'VNPAY', color: '#0EA5E9' },
    MOMO: { code: 'MOMO', name: 'MoMo', color: '#EC4899' },
    ZALOPAY: { code: 'ZALOPAY', name: 'ZaloPay', color: '#3B82F6' },
    BANK: { code: 'BANK', name: 'Chuyển khoản', color: '#16A34A' },
    BANK_TRANSFER: {
      code: 'BANK_TRANSFER',
      name: 'Chuyển khoản',
      color: '#16A34A',
    },
    CASH: { code: 'CASH', name: 'Tiền mặt', color: '#F59E0B' },
  },

  DISCOUNT_TYPE: {
    PERCENT: { code: 'PERCENT', name: 'Phần trăm', color: '#8B5CF6' },
    FIXED: { code: 'FIXED', name: 'Số tiền', color: '#F59E0B' },
  },

  /* ============================================================
   * 11. ĐÁNH GIÁ / LIÊN HỆ / OTP
   * ============================================================ */
  REVIEW_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ duyệt', color: '#F59E0B' },
    APPROVED: { code: 'APPROVED', name: 'Đã duyệt', color: '#16A34A' },
    REJECTED: { code: 'REJECTED', name: 'Từ chối', color: '#DC2626' },
  },

  CONTACT_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý', color: '#F59E0B' },
    PROCESSING: { code: 'PROCESSING', name: 'Đang xử lý', color: '#0EA5E9' },
    RESOLVED: { code: 'RESOLVED', name: 'Đã xử lý', color: '#16A34A' },
  },

  OTP_METHOD: {
    EMAIL: { code: 'EMAIL', name: 'Email', color: '#0EA5E9' },
    SMS: { code: 'SMS', name: 'SMS', color: '#F59E0B' },
  },
} as const;

/* ============================================================
 * TYPE HELPERS
 * ============================================================ */
export type EnumItem = { code: string; name: string; color: string };
export type EnumGroup = Record<string, EnumItem>;

export const enumToArray = (group: EnumGroup): EnumItem[] =>
  Object.values(group);

export const enumByCode = (
  group: EnumGroup,
  code: string,
): EnumItem | undefined =>
  Object.values(group).find(
    (i) => i.code.toLowerCase() === code?.toLowerCase(),
  );

export const enumName = (group: EnumGroup, code: string): string =>
  enumByCode(group, code)?.name ?? code;

export const enumColor = (group: EnumGroup, code: string): string =>
  enumByCode(group, code)?.color ?? '#64748B';
