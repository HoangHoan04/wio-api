const USER_ROLE = {
  CUSTOMER: { code: 'CUSTOMER', name: 'Khách hàng' },
  ADMIN: { code: 'ADMIN', name: 'Quản trị viên' },
};

const INVITATION_STATUS = {
  DRAFT: { code: 'DRAFT', name: 'Nháp', color: 'gray' },
  PUBLISHED: { code: 'PUBLISHED', name: 'Đã xuất bản', color: 'green' },
  ARCHIVED: { code: 'ARCHIVED', name: 'Đã lưu trữ', color: 'blue' },
};

const INVITATION_MODULE = {
  RSVP: { code: 'RSVP', name: 'RSVP' },
  GUESTBOOK: { code: 'GUESTBOOK', name: 'Sổ lời chúc' },
  GIFTS: { code: 'GIFTS', name: 'Quà / chuyển khoản' },
  SEATING: { code: 'SEATING', name: 'Sơ đồ bàn' },
  PHOTO_WALL: { code: 'PHOTO_WALL', name: 'Tường ảnh' },
  GALLERY: { code: 'GALLERY', name: 'Album ảnh' },
  MAP: { code: 'MAP', name: 'Bản đồ' },
  COUNTDOWN: { code: 'COUNTDOWN', name: 'Đếm ngược' },
  MUSIC: { code: 'MUSIC', name: 'Nhạc nền' },
  DRESS_CODE: { code: 'DRESS_CODE', name: 'Dress code' },
  TIMELINE: { code: 'TIMELINE', name: 'Lịch trình' },
};

const WIZARD_SECTION = {
  BASIC: { code: 'BASIC', name: 'Thông tin cơ bản' },
  HOSTS: { code: 'HOSTS', name: 'Người trên thiệp' },
  EVENTS: { code: 'EVENTS', name: 'Sự kiện' },
  TIMELINE: { code: 'TIMELINE', name: 'Lịch trình' },
  GALLERY: { code: 'GALLERY', name: 'Album ảnh' },
  DRESS_CODE: { code: 'DRESS_CODE', name: 'Dress code' },
  RSVP: { code: 'RSVP', name: 'RSVP' },
  GUESTBOOK: { code: 'GUESTBOOK', name: 'Sổ lời chúc' },
  GIFTS: { code: 'GIFTS', name: 'Quà / chuyển khoản' },
  MUSIC: { code: 'MUSIC', name: 'Nhạc nền' },
  THANK_YOU: { code: 'THANK_YOU', name: 'Lời cảm ơn' },
  EXTRA: { code: 'EXTRA', name: 'Nội dung thêm' },
};

const HOST_ROLE = {
  GROOM: { code: 'GROOM', name: 'Chú rể' },
  BRIDE: { code: 'BRIDE', name: 'Cô dâu' },
  HONOREE: { code: 'HONOREE', name: 'Người được tổ chức' },
  GRADUATE: { code: 'GRADUATE', name: 'Tân khoa' },
  BABY: { code: 'BABY', name: 'Bé' },
  PARENT: { code: 'PARENT', name: 'Bố mẹ' },
  HOST: { code: 'HOST', name: 'Chủ thiệp' },
  CUSTOM: { code: 'CUSTOM', name: 'Khác' },
};

const EVENT_KEY = {
  ENGAGEMENT: { code: 'ENGAGEMENT', name: 'Lễ ăn hỏi' },
  CEREMONY: { code: 'CEREMONY', name: 'Lễ chính' },
  RECEPTION: { code: 'RECEPTION', name: 'Tiệc' },
  PARTY: { code: 'PARTY', name: 'Tiệc' },
  CUSTOM: { code: 'CUSTOM', name: 'Khác' },
};

const GUEST_GROUP = {
  GROOM: { code: 'GROOM', name: 'Bên chú rể' },
  BRIDE: { code: 'BRIDE', name: 'Bên cô dâu' },
  BOTH: { code: 'BOTH', name: 'Cả hai bên' },
  FAMILY: { code: 'FAMILY', name: 'Gia đình' },
  FRIENDS: { code: 'FRIENDS', name: 'Bạn bè' },
  WORK: { code: 'WORK', name: 'Đồng nghiệp' },
  TEACHERS: { code: 'TEACHERS', name: 'Thầy cô' },
  PATERNAL: { code: 'PATERNAL', name: 'Bên nội' },
  MATERNAL: { code: 'MATERNAL', name: 'Bên ngoại' },
};

const REVIEW_STATUS = {
  PENDING: { code: 'PENDING', name: 'Chờ duyệt' },
  APPROVED: { code: 'APPROVED', name: 'Đã duyệt' },
  REJECTED: { code: 'REJECTED', name: 'Từ chối' },
};

const PHOTO_KIND = {
  HERO: { code: 'HERO', name: 'Ảnh bìa' },
  GALLERY: { code: 'GALLERY', name: 'Album' },
  OTHER: { code: 'OTHER', name: 'Khác' },
};

const SECTION_FLAG = {
  SHOW_HERO: { code: 'showHero', name: 'Ảnh cover' },
  SHOW_INTRO: { code: 'showIntro', name: 'Giới thiệu' },
  SHOW_GALLERY: { code: 'showGallery', name: 'Album' },
  SHOW_COUNTDOWN: { code: 'showCountdown', name: 'Đếm ngược' },
  SHOW_MAP: { code: 'showMap', name: 'Bản đồ' },
  SHOW_DRESS_CODE: { code: 'showDressCode', name: 'Dress code' },
  SHOW_TIMELINE: { code: 'showTimeline', name: 'Lịch trình' },
  SHOW_RSVP: { code: 'showRsvp', name: 'RSVP' },
  SHOW_GUESTBOOK: { code: 'showGuestbook', name: 'Sổ lời chúc' },
  SHOW_GIFTS: { code: 'showGifts', name: 'Quà' },
  SHOW_THANK_YOU: { code: 'showThankYou', name: 'Lời cảm ơn' },
  GUESTBOOK_STATIC: { code: 'guestbookStatic', name: 'Lời chúc tĩnh' },
  GUESTBOOK_FLOATING: { code: 'guestbookFloating', name: 'Lời chúc nổi' },
};

const CORE_MODULES = [
  INVITATION_MODULE.RSVP.code,
  INVITATION_MODULE.GUESTBOOK.code,
  INVITATION_MODULE.GALLERY.code,
  INVITATION_MODULE.MAP.code,
  INVITATION_MODULE.COUNTDOWN.code,
  INVITATION_MODULE.MUSIC.code,
];

const CORE_SECTIONS = [
  WIZARD_SECTION.BASIC.code,
  WIZARD_SECTION.HOSTS.code,
  WIZARD_SECTION.EVENTS.code,
  WIZARD_SECTION.GALLERY.code,
  WIZARD_SECTION.RSVP.code,
  WIZARD_SECTION.GUESTBOOK.code,
  WIZARD_SECTION.GIFTS.code,
  WIZARD_SECTION.MUSIC.code,
  WIZARD_SECTION.THANK_YOU.code,
];

export const enumData = {
  GENDER: {
    MALE: { code: 'MALE', name: 'Nam' },
    FEMALE: { code: 'FEMALE', name: 'Nữ' },
    OTHER: { code: 'OTHER', name: 'Khác' },
  },

  ACTION_TYPE: {
    CREATE: { code: 'CREATE', name: 'Thêm mới', type: 'ThemMoi' },
    DELETE: { code: 'DELETE', name: 'Xoá bỏ', type: 'XoaBo' },
    UPDATE: { code: 'UPDATE', name: 'Cập nhật', type: 'CapNhat' },
    SYNC: { code: 'SYNC', name: 'Đồng bộ', type: 'DongBo' },
    EDIT: { code: 'EDIT', name: 'Chỉnh sửa', type: 'ChinhSua' },
    APPROVE: { code: 'APPROVE', name: 'Duyệt', type: 'Duyet' },
    SEND_APPROVE: { code: 'SEND_APPROVE', name: 'Gửi duyệt', type: 'GuiDuyet' },
    REJECT: { code: 'REJECT', name: 'Từ chối', type: 'TuChoi' },
    CANCEL: { code: 'CANCEL', name: 'Huỷ', type: 'Huy' },
    IMPORT_EXCEL: {
      code: 'IMPORT_EXCEL',
      name: 'Nhập excel',
      type: 'NhapExcel',
    },
    ACTIVATE: { code: 'ACTIVATE', name: 'Kích hoạt', type: 'KichHoat' },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      name: 'Ngưng hoạt động',
      type: 'NgungHoatDong',
    },
    RESTORE: { code: 'RESTORE', name: 'Khôi phục', type: 'KhoiPhuc' },
    AWARD: { code: 'AWARD', name: 'Trao thưởng', type: 'TraoThuong' },
    LOGIN: { code: 'LOGIN', name: 'Đăng nhập', type: 'DangNhap' },
    LOGOUT: { code: 'LOGOUT', name: 'Đăng xuất', type: 'DangXuat' },
    REGISTER: { code: 'REGISTER', name: 'Đăng ký', type: 'DangKy' },
    UPLOAD_FILE: {
      code: 'UPLOAD_FILE',
      name: 'Tải file lên',
      type: 'TaiFileLen',
    },
    PUBLISH: { code: 'PUBLISH', name: 'Xuất bản', type: 'XuatBan' },
    UNPUBLISH: { code: 'UNPUBLISH', name: 'Hủy xuất bản', type: 'HuyXuatBan' },
  },

  USER_ROLE,

  INVITATION_STATUS,

  INVITATION_MODULE,
  WIZARD_SECTION,
  HOST_ROLE,
  EVENT_KEY,
  GUEST_GROUP,
  PHOTO_KIND,
  SECTION_FLAG,
  REVIEW_STATUS,

  STOCK_ASSET_KIND: {
    STICKER: { code: 'sticker', name: 'Sticker' },
    EMOJI: { code: 'emoji', name: 'Emoji' },
    ORNAMENT: { code: 'ornament', name: 'Họa tiết' },
  },

  STOCK_ASSET_CATEGORY: {
    HEARTS: { code: 'hearts', name: 'Trái tim' },
    FLOWERS: { code: 'flowers', name: 'Hoa' },
    PARTY: { code: 'party', name: 'Tiệc' },
    WEDDING: { code: 'wedding', name: 'Cưới' },
    GRADUATION: { code: 'graduation', name: 'Tốt nghiệp' },
    BIRTHDAY: { code: 'birthday', name: 'Sinh nhật' },
    BABY: { code: 'baby', name: 'Baby' },
    NATURE: { code: 'nature', name: 'Thiên nhiên' },
    STARS: { code: 'stars', name: 'Sao & lấp lánh' },
    ORNAMENT: { code: 'ornament', name: 'Họa tiết' },
  },

  CARD_TYPE: {
    WEDDING: {
      code: 'WEDDING',
      name: 'Thiệp cưới',
      slug: 'cuoi',
      accentColor: '#8B2942',
      icon: 'Heart',
      sortOrder: 1,
      defaultModules: [
        ...CORE_MODULES,
        INVITATION_MODULE.GIFTS.code,
        INVITATION_MODULE.SEATING.code,
        INVITATION_MODULE.PHOTO_WALL.code,
        INVITATION_MODULE.DRESS_CODE.code,
        INVITATION_MODULE.TIMELINE.code,
      ],
      defaultGuestGroups: [
        GUEST_GROUP.GROOM,
        GUEST_GROUP.BRIDE,
        GUEST_GROUP.BOTH,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.GROOM.code,
          label: HOST_ROLE.GROOM.name,
          required: true,
          max: 1,
        },
        {
          code: HOST_ROLE.BRIDE.code,
          label: HOST_ROLE.BRIDE.name,
          required: true,
          max: 1,
        },
      ],
      wizardSections: [
        ...CORE_SECTIONS,
        WIZARD_SECTION.TIMELINE.code,
        WIZARD_SECTION.DRESS_CODE.code,
        WIZARD_SECTION.EXTRA.code,
      ],
    },
    BIRTHDAY: {
      code: 'BIRTHDAY',
      name: 'Thiệp sinh nhật',
      slug: 'sinh-nhat',
      accentColor: '#E25C3A',
      icon: 'Cake',
      sortOrder: 2,
      defaultModules: [
        ...CORE_MODULES,
        INVITATION_MODULE.GIFTS.code,
        INVITATION_MODULE.PHOTO_WALL.code,
      ],
      defaultGuestGroups: [
        GUEST_GROUP.FAMILY,
        GUEST_GROUP.FRIENDS,
        GUEST_GROUP.WORK,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.HONOREE.code,
          label: HOST_ROLE.HONOREE.name,
          required: true,
          max: 1,
        },
      ],
      wizardSections: [...CORE_SECTIONS, WIZARD_SECTION.EXTRA.code],
    },
    GRADUATION: {
      code: 'GRADUATION',
      name: 'Thiệp tốt nghiệp',
      slug: 'tot-nghiep',
      accentColor: '#1E3A5F',
      icon: 'GraduationCap',
      sortOrder: 3,
      defaultModules: [
        ...CORE_MODULES,
        INVITATION_MODULE.PHOTO_WALL.code,
        INVITATION_MODULE.TIMELINE.code,
      ],
      defaultGuestGroups: [
        GUEST_GROUP.FAMILY,
        GUEST_GROUP.FRIENDS,
        GUEST_GROUP.TEACHERS,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.GRADUATE.code,
          label: HOST_ROLE.GRADUATE.name,
          required: true,
          max: 1,
        },
      ],
      wizardSections: [
        ...CORE_SECTIONS,
        WIZARD_SECTION.TIMELINE.code,
        WIZARD_SECTION.EXTRA.code,
      ],
    },
    BABY: {
      code: 'BABY',
      name: 'Thôi nôi / đầy tháng',
      slug: 'thoi-noi',
      accentColor: '#D4A0A7',
      icon: 'Baby',
      sortOrder: 4,
      defaultModules: [
        ...CORE_MODULES,
        INVITATION_MODULE.GIFTS.code,
        INVITATION_MODULE.PHOTO_WALL.code,
      ],
      defaultGuestGroups: [
        GUEST_GROUP.PATERNAL,
        GUEST_GROUP.MATERNAL,
        GUEST_GROUP.FRIENDS,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.BABY.code,
          label: HOST_ROLE.BABY.name,
          required: true,
          max: 1,
        },
        {
          code: HOST_ROLE.PARENT.code,
          label: HOST_ROLE.PARENT.name,
          required: false,
          max: 2,
        },
      ],
      wizardSections: [...CORE_SECTIONS, WIZARD_SECTION.EXTRA.code],
    },
    HOUSEWARMING: {
      code: 'HOUSEWARMING',
      name: 'Thiệp tân gia',
      slug: 'tan-gia',
      accentColor: '#C45C26',
      icon: 'Home',
      sortOrder: 5,
      defaultModules: [...CORE_MODULES, INVITATION_MODULE.GIFTS.code],
      defaultGuestGroups: [
        GUEST_GROUP.FAMILY,
        GUEST_GROUP.FRIENDS,
        GUEST_GROUP.WORK,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.HOST.code,
          label: HOST_ROLE.HOST.name,
          required: true,
          max: 2,
        },
      ],
      wizardSections: CORE_SECTIONS,
    },
    ANNIVERSARY: {
      code: 'ANNIVERSARY',
      name: 'Thiệp kỷ niệm',
      slug: 'ky-niem',
      accentColor: '#B8860B',
      icon: 'Sparkles',
      sortOrder: 6,
      defaultModules: CORE_MODULES,
      defaultGuestGroups: [GUEST_GROUP.FAMILY, GUEST_GROUP.FRIENDS],
      hostRoles: [
        {
          code: HOST_ROLE.HOST.code,
          label: HOST_ROLE.HOST.name,
          required: true,
          max: 4,
        },
      ],
      wizardSections: [...CORE_SECTIONS, WIZARD_SECTION.EXTRA.code],
    },
    CUSTOM: {
      code: 'CUSTOM',
      name: 'Sự kiện khác',
      slug: 'su-kien',
      accentColor: '#C45C26',
      icon: 'Mail',
      sortOrder: 7,
      defaultModules: CORE_MODULES,
      defaultGuestGroups: [
        GUEST_GROUP.FAMILY,
        GUEST_GROUP.FRIENDS,
        GUEST_GROUP.WORK,
      ],
      hostRoles: [
        {
          code: HOST_ROLE.HOST.code,
          label: HOST_ROLE.HOST.name,
          required: true,
          max: 6,
        },
      ],
      wizardSections: CORE_SECTIONS,
    },
  },

  MUSIC_TYPE: {
    UPLOAD: { code: 'UPLOAD', name: 'Tải lên' },
    YOUTUBE: { code: 'YOUTUBE', name: 'YouTube' },
    SPOTIFY: { code: 'SPOTIFY', name: 'Spotify' },
  },

  RSVP_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chưa phản hồi' },
    ATTENDING: { code: 'ATTENDING', name: 'Tham dự' },
    DECLINED: { code: 'DECLINED', name: 'Từ chối' },
  },

  NOTIF_CHANNEL: {
    ZALO: { code: 'ZALO', name: 'Zalo' },
    SMS: { code: 'SMS', name: 'SMS' },
    EMAIL: { code: 'EMAIL', name: 'Email' },
  },

  NOTIF_TYPE: {
    INVITE: { code: 'INVITE', name: 'Lời mời' },
    REMINDER: { code: 'REMINDER', name: 'Nhắc nhở' },
    THANK_YOU: { code: 'THANK_YOU', name: 'Cảm ơn' },
    RSVP_CONFIRM: { code: 'RSVP_CONFIRM', name: 'Xác nhận RSVP' },
  },

  NOTIF_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ gửi' },
    SENT: { code: 'SENT', name: 'Đã gửi' },
    FAILED: { code: 'FAILED', name: 'Gửi thất bại' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy' },
  },

  SUB_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hạn' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy' },
  },

  TX_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ thanh toán' },
    PAID: { code: 'PAID', name: 'Đã thanh toán' },
    FAILED: { code: 'FAILED', name: 'Thất bại' },
    REFUNDED: { code: 'REFUNDED', name: 'Đã hoàn' },
  },

  TX_METHOD: {
    VNPAY: { code: 'VNPAY', name: 'VNPAY' },
    MOMO: { code: 'MOMO', name: 'MoMo' },
    ZALOPAY: { code: 'ZALOPAY', name: 'ZaloPay' },
    BANK: { code: 'BANK', name: 'Chuyển khoản' },
  },

  DISCOUNT_TYPE: {
    PERCENT: { code: 'PERCENT', name: 'Phần trăm' },
    FIXED: { code: 'FIXED', name: 'Số tiền' },
  },

  MUSIC_PROCESS_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý' },
    PROCESSING: { code: 'PROCESSING', name: 'Đang xử lý' },
    COMPLETED: { code: 'COMPLETED', name: 'Hoàn tất' },
    FAILED: { code: 'FAILED', name: 'Thất bại' },
  },

  THEME_CODE: {
    BOHO_FLORAL_BROWN: {
      code: 'BOHO_FLORAL_BROWN',
      name: 'Hoa cỏ - Nâu',
      slug: 'hoa-moc-lan-nau',
    },
    BOHO_FLORAL_GREEN: {
      code: 'BOHO_FLORAL_GREEN',
      name: 'Hoa cỏ - Xanh',
      slug: 'hoa-moc-lan-xanh',
    },
    BOHO_FLORAL_PINK: {
      code: 'BOHO_FLORAL_PINK',
      name: 'Hoa cỏ - Hồng',
      slug: 'hoa-moc-lan-hong',
    },
    DRAGON_PHOENIX_RED: {
      code: 'DRAGON_PHOENIX_RED',
      name: 'Long phụng - Đỏ',
      slug: 'long-phung-do',
    },
    RED_DOUBLE_HAPPINESS: {
      code: 'RED_DOUBLE_HAPPINESS',
      name: 'Song hỷ - Đỏ truyền thống',
      slug: 'song-hy-do-truyen-thong',
    },
    ROYAL_RED: {
      code: 'ROYAL_RED',
      name: 'Hoàng gia - Đỏ nhung',
      slug: 'hoang-gia-do-nhung',
    },
    BIRTHDAY_CORAL: {
      code: 'BIRTHDAY_CORAL',
      name: 'Sinh nhật - Coral',
      slug: 'sinh-nhat-coral',
    },
    GRAD_NAVY: {
      code: 'GRAD_NAVY',
      name: 'Tốt nghiệp - Navy',
      slug: 'tot-nghiep-navy',
    },
    BABY_BLUSH: {
      code: 'BABY_BLUSH',
      name: 'Thôi nôi - Blush',
      slug: 'thoi-noi-blush',
    },
    CUSTOM_DESIGN: {
      code: 'CUSTOM_DESIGN',
      name: 'Tự thiết kế',
      slug: 'tu-thiet-ke',
    },
  },

  BRAND: {
    NAME: { code: 'WIO', name: 'Wio' },
    TAGLINE: { code: 'TAGLINE', name: 'Thiệp đẹp cho mọi dịp' },
  },
};
