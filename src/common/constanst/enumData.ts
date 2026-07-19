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
  },

  USER_ROLE: {
    COUPLE: { code: 'COUPLE', name: 'Cặp đôi' },
    ADMIN: { code: 'ADMIN', name: 'Quản trị viên' },
  },

  WEDDING_STATUS: {
    DRAFT: { code: 'DRAFT', name: 'Nháp', color: 'gray' },
    PUBLISHED: { code: 'PUBLISHED', name: 'Đã xuất bản', color: 'green' },
    ARCHIVED: { code: 'ARCHIVED', name: 'Đã lưu trữ', color: 'blue' },
  },

  MUSIC_TYPE: {
    UPLOAD: { code: 'UPLOAD', name: 'Tải lên' },
    YOUTUBE: { code: 'YOUTUBE', name: 'YouTube' },
    SPOTIFY: { code: 'SPOTIFY', name: 'Spotify' },
  },

  GUEST_SIDE: {
    GROOM: { code: 'GROOM', name: 'Bên chú rể' },
    BRIDE: { code: 'BRIDE', name: 'Bên cô dâu' },
    BOTH: { code: 'BOTH', name: 'Cả hai bên' },
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

  MUSIC_PROCESS_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý' },
    PROCESSING: { code: 'PROCESSING', name: 'Đang xử lý' },
    COMPLETED: { code: 'COMPLETED', name: 'Hoàn tất' },
    FAILED: { code: 'FAILED', name: 'Thất bại' },
  },

  THEME_CODE: {
    BOHO_FLORAL_BROWN: {
      code: 'BOHO_FLORAL_BROWN',
      name: 'Hoa mộc Lan - Nâu',
      slug: 'hoa-moc-lan-nau',
    },
    BOHO_FLORAL_GREEN: {
      code: 'BOHO_FLORAL_GREEN',
      name: 'Hoa mộc Lan - Xanh',
      slug: 'hoa-moc-lan-xanh',
    },
    BOHO_FLORAL_PINK: {
      code: 'BOHO_FLORAL_PINK',
      name: 'Hoa mộc Lan - Hồng',
      slug: 'hoa-moc-lan-hong',
    },
    DRAGON_PHOENIX_BLUE: {
      code: 'DRAGON_PHOENIX_BLUE',
      name: 'Long phụng - Xanh',
      slug: 'long-phung-xanh',
    },
    DRAGON_PHOENIX_GREEN: {
      code: 'DRAGON_PHOENIX_GREEN',
      name: 'Long phụng - Xanh lá',
      slug: 'long-phung-xanh-la',
    },
    DRAGON_PHOENIX_RED: {
      code: 'DRAGON_PHOENIX_RED',
      name: 'Long phụng - Đỏ',
      slug: 'long-phung-do',
    },
    ROYAL_BLUE: {
      code: 'ROYAL_BLUE',
      name: 'Hoàng gia - Xanh',
      slug: 'hoang-gia-xanh',
    },
    ROYAL_GREEN: {
      code: 'ROYAL_GREEN',
      name: 'Hoàng gia - Xanh lá',
      slug: 'hoang-gia-xanh-la',
    },
    ROYAL_RED: {
      code: 'ROYAL_RED',
      name: 'Hoàng gia - Đỏ',
      slug: 'hoang-gia-do',
    },
    RED_DOUBLE_HAPPINESS: {
      code: 'RED_DOUBLE_HAPPINESS',
      name: 'Song hỷ - Đỏ',
      slug: 'song-hy-do',
    },
  },
};
