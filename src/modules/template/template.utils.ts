import { enumData } from '@/common/constanst/enumData';
import * as ExcelJS from 'exceljs';

export function generateTemplateSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function cellToString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    const obj = val as Record<string, any>;
    if (Array.isArray(obj.richText)) {
      return obj.richText.map((t: any) => t.text || '').join('');
    }
    if (typeof obj.text === 'string') return obj.text;
    if (obj.result !== undefined && obj.result !== null) {
      return String(obj.result);
    }
    if (val instanceof Date) return val.toISOString();
  }
  return String(val).trim();
}

export function parseBool(val: unknown, fallback = false): boolean {
  const raw = cellToString(val).toLowerCase();
  if (!raw) return fallback;
  if (['true', '1', 'yes', 'y', 'co', 'có', 'x'].includes(raw)) return true;
  if (['false', '0', 'no', 'n', 'khong', 'không'].includes(raw)) return false;
  return fallback;
}

export function parseIntValue(
  val: unknown,
  fallback?: number,
): number | undefined {
  if (val === null || val === undefined || val === '') return fallback;
  const n = Number(cellToString(val));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function parseStringList(val: unknown): string[] {
  const raw = cellToString(val);
  if (!raw) return [];
  return raw
    .split(/[\n\r,;|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseJsonObject(val: unknown): Record<string, any> | undefined {
  if (
    val &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !(val as any).richText
  ) {
    return val as Record<string, any>;
  }
  const raw = cellToString(val);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed)) return { list: parsed };
  } catch {
    return undefined;
  }
  return undefined;
}

export function normalizeTemplateFeatures(
  value: unknown,
): Record<string, any> | undefined {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) {
    const list = value.map((v) => String(v).trim()).filter(Boolean);
    return list.length ? { list } : undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      return normalizeTemplateFeatures(JSON.parse(trimmed));
    } catch {
      const list = parseStringList(trimmed);
      return list.length ? { list } : undefined;
    }
  }
  if (typeof value === 'object') return value as Record<string, any>;
  return undefined;
}

export function resolveEnumCode(
  enumObj: Record<string, { code: string; name: string }>,
  input: unknown,
): string | undefined {
  const raw = cellToString(input);
  if (!raw) return undefined;
  const upper = raw.toUpperCase().replace(/[\s-]+/g, '_');
  for (const item of Object.values(enumObj)) {
    if (
      item.code === raw ||
      item.code === upper ||
      item.name === raw ||
      item.name.toLowerCase() === raw.toLowerCase()
    ) {
      return item.code;
    }
  }
  return undefined;
}

export const TEMPLATE_EXCEL_HEADERS = [
  { header: 'Tên mẫu (*)', key: 'name', width: 28 },
  { header: 'Slug', key: 'slug', width: 24 },
  { header: 'Mô tả', key: 'description', width: 36 },
  { header: 'Phong cách cưới (*)', key: 'weddingTheme', width: 22 },
  { header: 'Mã theme (*)', key: 'themeCode', width: 26 },
  { header: 'Loại mẫu', key: 'kind', width: 18 },
  { header: 'Version', key: 'version', width: 12 },
  { header: 'Tông màu', key: 'colorMood', width: 16 },
  { header: 'Tags', key: 'tags', width: 24 },
  { header: 'URL thumbnail', key: 'thumbnailUrl', width: 32 },
  { header: 'URL xem trước', key: 'previewUrl', width: 32 },
  { header: 'Hiển thị (true/false)', key: 'isShow', width: 20 },
  { header: 'Premium (true/false)', key: 'isPremium', width: 20 },
  { header: 'Mã gói tối thiểu', key: 'minPlanCode', width: 20 },
  { header: 'Số ngày dùng thử', key: 'trialDays', width: 18 },
  { header: 'Thứ tự', key: 'sortOrder', width: 12 },
  { header: 'Danh mục (phong cách)', key: 'categories', width: 28 },
  { header: 'Tính năng nổi bật', key: 'features', width: 32 },
  { header: 'Kiểu phong bì', key: 'envelopeStyle', width: 18 },
  { header: 'Kiểu ảnh bìa', key: 'heroStyle', width: 18 },
  { header: 'Thứ tự mục', key: 'sectionOrder', width: 36 },
  { header: 'Màu nền', key: 'colorBackground', width: 14 },
  { header: 'Màu chữ chính', key: 'colorTextPrimary', width: 16 },
  { header: 'Màu chữ phụ', key: 'colorTextSecondary', width: 16 },
  { header: 'Màu nhấn', key: 'colorAccent', width: 14 },
  { header: 'Màu phong bì', key: 'colorEnvelope', width: 14 },
  { header: 'Màu nền nút', key: 'colorButtonBg', width: 14 },
  { header: 'Màu chữ nút', key: 'colorButtonText', width: 14 },
  { header: 'Font tiêu đề', key: 'fontHeading', width: 22 },
  { header: 'Font nội dung', key: 'fontBody', width: 22 },
  { header: 'Font chữ ký', key: 'fontScript', width: 22 },
  { header: 'Màu nền canvas', key: 'canvasBackground', width: 16 },
  { header: 'Độ mờ nền canvas (%)', key: 'canvasOpacity', width: 20 },
  { header: 'Chiều cao canvas', key: 'canvasHeight', width: 16 },
  { header: 'Ảnh nền canvas', key: 'canvasBackgroundImage', width: 28 },
] as const;

export const TEMPLATE_EXCEL_HEADER_ALIASES: Record<string, string> = {
  name: 'name',
  'tên mẫu': 'name',
  'tên mẫu (*)': 'name',
  'ten mau': 'name',
  slug: 'slug',
  description: 'description',
  'mô tả': 'description',
  'mo ta': 'description',
  weddingtheme: 'weddingTheme',
  'phong cách cưới': 'weddingTheme',
  'phong cách cưới (*)': 'weddingTheme',
  'phong cach cuoi': 'weddingTheme',
  themecode: 'themeCode',
  'mã theme': 'themeCode',
  'mã theme (*)': 'themeCode',
  'ma theme': 'themeCode',
  kind: 'kind',
  'loại mẫu': 'kind',
  'loai mau': 'kind',
  version: 'version',
  colormood: 'colorMood',
  'tông màu': 'colorMood',
  'tong mau': 'colorMood',
  tags: 'tags',
  thumbnailurl: 'thumbnailUrl',
  'url thumbnail': 'thumbnailUrl',
  previewurl: 'previewUrl',
  'url xem trước': 'previewUrl',
  'url xem truoc': 'previewUrl',
  isshow: 'isShow',
  'hiển thị': 'isShow',
  'hiển thị (true/false)': 'isShow',
  'hien thi': 'isShow',
  ispremium: 'isPremium',
  premium: 'isPremium',
  'premium (true/false)': 'isPremium',
  minplancode: 'minPlanCode',
  minplanid: 'minPlanCode',
  'mã gói tối thiểu': 'minPlanCode',
  'ma goi toi thieu': 'minPlanCode',
  trialdays: 'trialDays',
  'số ngày dùng thử': 'trialDays',
  'so ngay dung thu': 'trialDays',
  sortorder: 'sortOrder',
  'thứ tự': 'sortOrder',
  'thu tu': 'sortOrder',
  categories: 'categories',
  'danh mục': 'categories',
  'danh mục (phong cách)': 'categories',
  'danh muc': 'categories',
  features: 'features',
  'tính năng nổi bật': 'features',
  'tinh nang noi bat': 'features',
  envelopestyle: 'envelopeStyle',
  'kiểu phong bì': 'envelopeStyle',
  'kieu phong bi': 'envelopeStyle',
  herostyle: 'heroStyle',
  'kiểu ảnh bìa': 'heroStyle',
  'kieu anh bia': 'heroStyle',
  sectionorder: 'sectionOrder',
  'thứ tự mục': 'sectionOrder',
  'thu tu muc': 'sectionOrder',
  colorbackground: 'colorBackground',
  'màu nền': 'colorBackground',
  'mau nen': 'colorBackground',
  colortextprimary: 'colorTextPrimary',
  'màu chữ chính': 'colorTextPrimary',
  'mau chu chinh': 'colorTextPrimary',
  colortextsecondary: 'colorTextSecondary',
  'màu chữ phụ': 'colorTextSecondary',
  'mau chu phu': 'colorTextSecondary',
  coloraccent: 'colorAccent',
  'màu nhấn': 'colorAccent',
  'mau nhan': 'colorAccent',
  colorenvelope: 'colorEnvelope',
  'màu phong bì': 'colorEnvelope',
  'mau phong bi': 'colorEnvelope',
  colorbuttonbg: 'colorButtonBg',
  'màu nền nút': 'colorButtonBg',
  'mau nen nut': 'colorButtonBg',
  colorbuttontext: 'colorButtonText',
  'màu chữ nút': 'colorButtonText',
  'mau chu nut': 'colorButtonText',
  fontheading: 'fontHeading',
  'font tiêu đề': 'fontHeading',
  'font tieu de': 'fontHeading',
  fontbody: 'fontBody',
  'font nội dung': 'fontBody',
  'font noi dung': 'fontBody',
  fontscript: 'fontScript',
  'font chữ ký': 'fontScript',
  'font chu ky': 'fontScript',
  canvasbackground: 'canvasBackground',
  'màu nền canvas': 'canvasBackground',
  'mau nen canvas': 'canvasBackground',
  canvasopacity: 'canvasOpacity',
  'độ mờ nền canvas (%)': 'canvasOpacity',
  'do mo nen canvas': 'canvasOpacity',
  canvasheight: 'canvasHeight',
  'chiều cao canvas': 'canvasHeight',
  'chieu cao canvas': 'canvasHeight',
  canvasbackgroundimage: 'canvasBackgroundImage',
  'ảnh nền canvas': 'canvasBackgroundImage',
  'anh nen canvas': 'canvasBackgroundImage',
  themelayout: 'themeLayout',
  'bố cục json': 'themeLayout',
  'bo cuc json': 'themeLayout',
  presettokens: 'presetTokens',
  'design tokens json': 'presetTokens',
  canvaspreset: 'canvasPreset',
  'canva preset json': 'canvasPreset',
};

export function normalizeExcelHeader(header: string): string | undefined {
  const key = header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9*()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return (
    TEMPLATE_EXCEL_HEADER_ALIASES[header.toLowerCase().trim()] ||
    TEMPLATE_EXCEL_HEADER_ALIASES[key]
  );
}

export const TEMPLATE_EXCEL_DATA_SHEET = 'Mau thiep';
export const TEMPLATE_EXCEL_ENUM_SHEET = 'Enum';
export const TEMPLATE_EXCEL_GUIDE_SHEET = 'Huong dan';

const ENVELOPE_STYLES = ['classic', 'minimal', 'none'] as const;
const HERO_STYLES = ['single', 'split', 'carousel'] as const;
const SECTION_IDS = [
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
] as const;

const ENVELOPE_STYLE_ITEMS = [
  { code: 'classic', name: 'Cổ điển' },
  { code: 'minimal', name: 'Tối giản' },
  { code: 'none', name: 'Không dùng phong bì' },
] as const;

const HERO_STYLE_ITEMS = [
  { code: 'single', name: '1 ảnh' },
  { code: 'split', name: '2 cột cô dâu / chú rể' },
  { code: 'carousel', name: 'Carousel' },
] as const;

const SECTION_ITEMS = [
  { code: 'hero', name: 'Ảnh đại diện' },
  { code: 'divider', name: 'Trang trí' },
  { code: 'familyInfo', name: 'Thông tin gia đình' },
  { code: 'hosts', name: 'Chủ thể' },
  { code: 'intro', name: 'Lời mời' },
  { code: 'ceremonies', name: 'Lễ / Sự kiện' },
  { code: 'countdown', name: 'Đếm ngược' },
  { code: 'gallery', name: 'Album ảnh' },
  { code: 'partyInfo', name: 'Thông tin tiệc' },
  { code: 'timeline', name: 'Lịch trình' },
  { code: 'rsvp', name: 'Xác nhận tham dự' },
  { code: 'map', name: 'Bản đồ' },
  { code: 'guestbook', name: 'Sổ lời chúc' },
  { code: 'giftBox', name: 'Mừng cưới / Quà' },
  { code: 'dressCode', name: 'Dress code' },
  { code: 'thankYou', name: 'Lời cảm ơn' },
] as const;

const FONT_ITEMS = [
  { code: "'Playfair Display', serif", name: 'Playfair Display' },
  { code: "'Cormorant Garamond', serif", name: 'Cormorant Garamond' },
  { code: "'Great Vibes', cursive", name: 'Great Vibes' },
  { code: "'Cinzel', serif", name: 'Cinzel' },
  { code: "'Outfit', sans-serif", name: 'Outfit' },
  { code: "'Montserrat', sans-serif", name: 'Montserrat' },
] as const;

const BOOL_ITEMS = [
  { code: 'true', name: 'Có' },
  { code: 'false', name: 'Không' },
] as const;

export type TemplateExcelEnumItem = { code: string; name: string };

export type TemplateExcelEnumGroup = {
  group: string;
  columnKey: string;
  required: boolean;
  note: string;
  allowMultiple?: boolean;
  items: TemplateExcelEnumItem[];
};

export function getTemplateExcelEnumGroups(): TemplateExcelEnumGroup[] {
  return [
    {
      group: 'Phong cách cưới',
      columnKey: 'weddingTheme',
      required: true,
      note: 'Điền đúng Mã vào cột Phong cách cưới (*)',
      items: Object.values(enumData.WEDDING_THEME).map((i) => ({
        code: i.code,
        name: i.name,
      })),
    },
    {
      group: 'Mã theme',
      columnKey: 'themeCode',
      required: true,
      note: 'Điền đúng Mã theme React trên web khách',
      items: Object.values(enumData.THEME_CODE).map((i) => ({
        code: i.code,
        name: i.name,
      })),
    },
    {
      group: 'Loại mẫu',
      columnKey: 'kind',
      required: false,
      note: 'Để trống sẽ mặc định CODE_THEME',
      items: Object.values(enumData.TEMPLATE_KIND).map((i) => ({
        code: i.code,
        name: i.name,
      })),
    },
    {
      group: 'Hiển thị / Premium',
      columnKey: 'isShow',
      required: false,
      note: 'Dùng true/false cho cột Hiển thị và Premium',
      items: [...BOOL_ITEMS],
    },
    {
      group: 'Mã gói tối thiểu',
      columnKey: 'minPlanCode',
      required: false,
      note: 'Mã gói dịch vụ, để trống nếu không giới hạn',
      items: Object.values(enumData.SERVICE_PLAN_CODE).map((i) => ({
        code: i.code,
        name: i.name,
      })),
    },
    {
      group: 'Danh mục (phong cách)',
      columnKey: 'categories',
      required: false,
      allowMultiple: true,
      note: 'Nhiều mã phong cách, cách nhau bởi dấu phẩy',
      items: Object.values(enumData.WEDDING_THEME).map((i) => ({
        code: i.code,
        name: i.name,
      })),
    },
    {
      group: 'Kiểu phong bì',
      columnKey: 'envelopeStyle',
      required: false,
      note: 'Để trống sẽ mặc định classic',
      items: [...ENVELOPE_STYLE_ITEMS],
    },
    {
      group: 'Kiểu ảnh bìa',
      columnKey: 'heroStyle',
      required: false,
      note: 'Để trống sẽ mặc định single',
      items: [...HERO_STYLE_ITEMS],
    },
    {
      group: 'Thứ tự mục',
      columnKey: 'sectionOrder',
      required: false,
      allowMultiple: true,
      note: 'Nhiều mã, cách nhau bởi dấu phẩy, theo thứ tự hiển thị',
      items: [...SECTION_ITEMS],
    },
    {
      group: 'Font chữ',
      columnKey: 'fontHeading',
      required: false,
      note: 'Copy nguyên cột Mã vào Font tiêu đề / nội dung / chữ ký',
      items: [...FONT_ITEMS],
    },
  ];
}

type EnumRange = { columnKey: string; start: number; end: number };

export function addTemplateExcelEnumSheet(
  workbook: ExcelJS.Workbook,
): EnumRange[] {
  const sheet = workbook.addWorksheet(TEMPLATE_EXCEL_ENUM_SHEET);
  sheet.columns = [
    { header: 'Nhóm', key: 'group', width: 28 },
    { header: 'Cột Excel', key: 'column', width: 26 },
    { header: 'Mã (điền cột này)', key: 'code', width: 36 },
    { header: 'Tên hiển thị', key: 'name', width: 40 },
    { header: 'Bắt buộc', key: 'required', width: 12 },
    { header: 'Ghi chú', key: 'note', width: 52 },
  ];

  sheet.spliceRows(1, 0, [
    'Chỉ điền đúng cột Mã. Có thể gõ tên hiển thị — hệ thống sẽ tự map. Xem dropdown trên sheet Mau thiep.',
  ]);
  sheet.mergeCells('A1:F1');
  sheet.getRow(1).font = { italic: true, color: { argb: 'FF5B4636' } };
  sheet.getRow(1).height = 22;
  sheet.getRow(2).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2D231F' },
  };

  const headerByKey = Object.fromEntries(
    TEMPLATE_EXCEL_HEADERS.map((col) => [col.key, col.header]),
  );
  const ranges: EnumRange[] = [];
  let rowNumber = 3;

  for (const group of getTemplateExcelEnumGroups()) {
    const start = rowNumber;
    group.items.forEach((item, index) => {
      sheet.addRow({
        group: index === 0 ? group.group : '',
        column:
          index === 0 ? headerByKey[group.columnKey] || group.columnKey : '',
        code: item.code,
        name: item.name,
        required: index === 0 ? (group.required ? 'Có' : 'Không') : '',
        note: index === 0 ? group.note : '',
      });
      rowNumber += 1;
    });
    if (!group.allowMultiple) {
      ranges.push({ columnKey: group.columnKey, start, end: rowNumber - 1 });
    }
    sheet.addRow({});
    rowNumber += 1;
  }

  sheet.views = [{ state: 'frozen', ySplit: 2 }];
  sheet.getColumn('code').font = { bold: true, color: { argb: 'FF8B5A2B' } };
  return ranges;
}

export function applyTemplateExcelEnumValidations(
  sheet: ExcelJS.Worksheet,
  ranges: EnumRange[],
  maxRow = 101,
) {
  const extraKeys: Record<string, string[]> = {
    isShow: ['isPremium'],
    fontHeading: ['fontBody', 'fontScript'],
  };

  const applyRange = (columnKey: string, range: EnumRange) => {
    const column = sheet.getColumn(columnKey);
    if (!column || !column.letter) return;
    for (let row = 2; row <= maxRow; row++) {
      sheet.getCell(`${column.letter}${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [
          `${TEMPLATE_EXCEL_ENUM_SHEET}!$C$${range.start}:$C$${range.end}`,
        ],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Giá trị không hợp lệ',
        error: `Chỉ điền đúng Mã trong sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
        showInputMessage: true,
        promptTitle: 'Enum',
        prompt: `Xem sheet ${TEMPLATE_EXCEL_ENUM_SHEET} — cột Mã`,
      };
    }
  };

  for (const range of ranges) {
    applyRange(range.columnKey, range);
    for (const extra of extraKeys[range.columnKey] || []) {
      applyRange(extra, range);
    }
  }
}

function pickStyle<T extends string>(
  input: unknown,
  allowed: readonly T[],
  fallback: T,
  labels?: readonly { code: string; name: string }[],
): T {
  const raw = cellToString(input);
  if (!raw) return fallback;
  const lower = raw.toLowerCase();
  const match = allowed.find(
    (item) => item === raw || item.toLowerCase() === lower,
  );
  if (match) return match;
  const byName = labels?.find((item) => item.name.toLowerCase() === lower);
  if (byName && (allowed as readonly string[]).includes(byName.code)) {
    return byName.code as T;
  }
  return fallback;
}

export function assembleThemeLayoutFromRow(
  record: Record<string, any>,
): Record<string, any> | undefined {
  const fromJson = parseJsonObject(record.themeLayout);
  if (fromJson) return fromJson;
  const envelopeStyle = pickStyle(
    record.envelopeStyle,
    ENVELOPE_STYLES,
    'classic',
    ENVELOPE_STYLE_ITEMS,
  );
  const heroStyle = pickStyle(
    record.heroStyle,
    HERO_STYLES,
    'single',
    HERO_STYLE_ITEMS,
  );
  const sectionOrder = parseStringList(record.sectionOrder)
    .map((id) => {
      const lower = id.toLowerCase();
      const found = SECTION_ITEMS.find(
        (item) =>
          item.code === id ||
          item.code.toLowerCase() === lower ||
          item.name.toLowerCase() === lower,
      );
      return found?.code;
    })
    .filter((id): id is (typeof SECTION_IDS)[number] => !!id);
  if (
    !cellToString(record.envelopeStyle) &&
    !cellToString(record.heroStyle) &&
    !sectionOrder.length
  ) {
    return undefined;
  }
  return {
    envelopeStyle,
    heroStyle,
    sectionOrder: sectionOrder.length ? sectionOrder : [...SECTION_IDS],
  };
}

function resolveFontValue(input: unknown): string {
  const raw = cellToString(input);
  if (!raw) return '';
  const lower = raw.toLowerCase();
  const found = FONT_ITEMS.find(
    (item) =>
      item.code === raw ||
      item.code.toLowerCase() === lower ||
      item.name.toLowerCase() === lower,
  );
  return found?.code || raw;
}

export function assemblePresetTokensFromRow(
  record: Record<string, any>,
  themeCode: string,
): Record<string, any> | undefined {
  const fromJson = parseJsonObject(record.presetTokens);
  if (fromJson) return fromJson;
  const colors = {
    background: cellToString(record.colorBackground),
    textPrimary: cellToString(record.colorTextPrimary),
    textSecondary: cellToString(record.colorTextSecondary),
    accent: cellToString(record.colorAccent),
    envelope: cellToString(record.colorEnvelope),
    buttonBg: cellToString(record.colorButtonBg),
    buttonText: cellToString(record.colorButtonText),
  };
  const fonts = {
    heading: resolveFontValue(record.fontHeading),
    body: resolveFontValue(record.fontBody),
    script: resolveFontValue(record.fontScript) || undefined,
  };
  const hasColor = Object.values(colors).some(Boolean);
  const hasFont = Boolean(fonts.heading || fonts.body);
  if (!hasColor && !hasFont) return undefined;
  return {
    code: themeCode,
    colors,
    fonts,
  };
}

export function assembleCanvasPresetFromRow(
  record: Record<string, any>,
): Record<string, any> | undefined {
  const fromJson = parseJsonObject(record.canvasPreset);
  if (fromJson) return fromJson;
  const canvasBackground = cellToString(record.canvasBackground);
  const canvasHeight = parseIntValue(record.canvasHeight);
  const opacityRaw = parseIntValue(record.canvasOpacity);
  const backgroundImageUrl = cellToString(record.canvasBackgroundImage);
  if (
    !canvasBackground &&
    canvasHeight == null &&
    opacityRaw == null &&
    !backgroundImageUrl
  ) {
    return undefined;
  }
  const backgroundOpacity =
    opacityRaw == null
      ? 1
      : opacityRaw > 1
        ? Math.min(1, opacityRaw / 100)
        : Math.min(1, Math.max(0, opacityRaw));
  return {
    schemaVersion: 1,
    canvasBackground: canvasBackground || '#FDFBF7',
    backgroundOpacity,
    canvasHeight: canvasHeight || 956,
    backgroundImageUrl: backgroundImageUrl || undefined,
    elements: [],
    effects: {},
  };
}

export function flattenThemeLayout(layout?: Record<string, any> | null) {
  return {
    envelopeStyle: layout?.envelopeStyle || '',
    heroStyle: layout?.heroStyle || '',
    sectionOrder: Array.isArray(layout?.sectionOrder)
      ? layout.sectionOrder.join(', ')
      : '',
  };
}

export function flattenPresetTokens(tokens?: Record<string, any> | null) {
  const colors = tokens?.colors || {};
  const fonts = tokens?.fonts || {};
  return {
    colorBackground: colors.background || '',
    colorTextPrimary: colors.textPrimary || '',
    colorTextSecondary: colors.textSecondary || '',
    colorAccent: colors.accent || '',
    colorEnvelope: colors.envelope || '',
    colorButtonBg: colors.buttonBg || '',
    colorButtonText: colors.buttonText || '',
    fontHeading: fonts.heading || '',
    fontBody: fonts.body || '',
    fontScript: fonts.script || '',
  };
}

export function flattenCanvasPreset(preset?: Record<string, any> | null) {
  const opacity = Number(preset?.backgroundOpacity);
  return {
    canvasBackground: preset?.canvasBackground || '',
    canvasOpacity: Number.isFinite(opacity)
      ? Math.round(opacity > 1 ? opacity : opacity * 100)
      : '',
    canvasHeight: preset?.canvasHeight || '',
    canvasBackgroundImage: preset?.backgroundImageUrl || '',
  };
}
