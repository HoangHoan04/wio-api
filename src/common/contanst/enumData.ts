export const enumData = {
  DATA_TYPE: {
    STRING: { code: 'string', name: 'Kiểu chuỗi', format: '' },
    INT: { code: 'int', name: 'Kiểu số nguyên', format: '' },
    FLOAT: { code: 'float', name: 'Kiểu số thập phân', format: '' },
    DATE: { code: 'date', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    DATETIME: {
      code: 'DATETIME',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    TIME: { code: 'TIME', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    BOOLEAN: { code: 'BOOLEAN', name: 'Kiểu checkbox', format: '' },
  },

  FIELD_TYPE: {
    TEXT: { code: 'TEXT', name: 'Kiểu chuỗi', format: '' },
    NUMBER: { code: 'NUMBER', name: 'Kiểu số nguyên', format: '' },
    BOOLEAN: { code: 'BOOLEAN', name: 'Kiểu checkbox', format: '' },
    DATE: { code: 'DATE', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    DATETIME: {
      code: 'DATETIME',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    TIME: { code: 'TIME', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    JSON: { code: 'JSON', name: 'Kiểu JSON', format: '' },
  },

  DAY_IN_WEEK: {
    SUNDAY: { code: 'SUNDAY', name: 'Chủ nhật' },
    MONDAY: { code: 'MONDAY', name: 'Thứ hai' },
    TUESDAY: { code: 'TUESDAY', name: 'Thứ ba' },
    WEDNESDAY: { code: 'WEDNESDAY', name: 'Thứ tư' },
    THURSDAY: { code: 'THURSDAY', name: 'Thứ năm' },
    FRIDAY: { code: 'FRIDAY', name: 'Thứ sáu' },
    SATURDAY: { code: 'SATURDAY', name: 'Thứ bảy' },
  },

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
    CREATE_EXAM: { code: 'CREATE_EXAM', name: 'Tạo đề thi', type: 'TaoDeThi' },
    SUBMIT_EXAM: {
      code: 'SUBMIT_EXAM',
      name: 'Nộp bài thi',
      type: 'NopBaiThi',
    },
    GRADE_EXAM: { code: 'GRADE_EXAM', name: 'Chấm thi', type: 'ChamThi' },
    PUBLISH: { code: 'PUBLISH', name: 'Xuất bản', type: 'XuatBan' },
    UNPUBLISH: { code: 'UNPUBLISH', name: 'Huỷ xuất bản', type: 'HuyXuatBan' },
    COMMENT: { code: 'COMMENT', name: 'Bình luận', type: 'BinhLuan' },
    APPROVE_COMMENT: {
      code: 'APPROVE_COMMENT',
      name: 'Duyệt bình luận',
      type: 'DuyetBinhLuan',
    },
    SEND_NOTIFICATION: {
      code: 'SEND_NOTIFICATION',
      name: 'Gửi thông báo',
      type: 'GuiThongBao',
    },
  },

  FILE_TYPE_ENUM: {
    IMAGE: { code: 'image', name: 'Hình ảnh' },
    VIDEO: { code: 'video', name: 'Video' },
    AUDIO: { code: 'audio', name: 'Âm thanh' },
    PDF: { code: 'pdf', name: 'PDF' },
    DOCX: { code: 'docx', name: 'Word Document' },
  },

  CONFIG_DATA_TYPE: {
    STRING: { code: 'string', name: 'Kiểu chuỗi' },
    NUMBER: { code: 'number', name: 'Kiểu số' },
    BOOLEAN: { code: 'boolean', name: 'Kiểu boolean' },
    JSON: { code: 'json', name: 'Kiểu JSON' },
  },

  OTP_SEND_METHOD: {
    ZALO: 'ZALO',
    EMAIL: 'EMAIL',
    SMS: 'SMS',
  },

  ZNS_TEMPLATE: {
    ZNS_TEMPLATE_ID_SEND_OTP: '',
  },

  LOGIN_PROVIDER: {
    LOCAL: 'LOCAL',
    ZALO: 'ZALO',
    GOOGLE: 'GOOGLE',
    FACEBOOK: 'FACEBOOK',
  },

  SETTING_TAB: {
    SYSTEM: 'SYSTEM',
  },

  FILE_TYPE: {},
};

export const millisecondInDay = 86400000;
export const SUCCESS = 0;
export const ACCESS_TOKEN_INVALID = -216;
export const OA_ID_INVALID = -217;
export const REFRESH_TOKEN_EXPIRED = -14005;
export const INVALID_REFRESH_TOKEN = -14006;

export const SystemConfig = {
  ZALO_REFRESH_TOKEN: {
    code: 'ZALO_REFRESH_TOKEN',
    name: 'Zalo Refresh Token',
    value: '',
    type: enumData.FIELD_TYPE.TEXT,
    settingTab: enumData.SETTING_TAB.SYSTEM,
    isHidden: true,
  },
  ZALO_ACCESS_TOKEN: {
    code: 'ZALO_ACCESS_TOKEN',
    name: 'Zalo Access Token',
    value: '',
    type: enumData.FIELD_TYPE.TEXT,
    settingTab: enumData.SETTING_TAB.SYSTEM,
    isHidden: true,
  },
  CHECK_ZALO: {
    code: 'CHECK_ZALO',
    name: 'Check_Zalo',
    value: '',
    type: enumData.FIELD_TYPE.TEXT,
    settingTab: enumData.SETTING_TAB.SYSTEM,
    isHidden: false,
  },
};

export const enumZalo = {
  ErrorCodeTableZalo: {
    '-124': { code: -124, message: 'Số điện thoại không hợp lệ' },
    '-201': { code: -201, message: 'Template không tồn tại' },
    '-214': { code: -214, message: 'Số dư tài khoản không đủ' },
    '-216': { code: -216, message: 'Access token không hợp lệ' },
    '-217': { code: -217, message: 'OA ID không hợp lệ' },
  },
};
