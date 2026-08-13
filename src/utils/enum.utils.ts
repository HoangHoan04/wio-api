type EnumItem = { code: string; name?: string; [key: string]: any };
type EnumGroup = Record<string, EnumItem>;

export function enumCodes<T extends EnumGroup>(group: T): string[] {
  return Object.values(group).map((item) => item.code);
}

export function isEnumCode<T extends EnumGroup>(
  group: T,
  code?: string | null,
): boolean {
  if (!code) return false;
  return Object.values(group).some((item) => item.code === code);
}

export function getEnumByCode<T extends EnumGroup>(
  group: T,
  code?: string | null,
): T[keyof T] | undefined {
  if (!code) return undefined;
  return Object.values(group).find((item) => item.code === code) as
    | T[keyof T]
    | undefined;
}

export function enumOptions<T extends EnumGroup>(group: T): EnumItem[] {
  return Object.values(group);
}
