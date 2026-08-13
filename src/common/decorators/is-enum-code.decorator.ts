import { enumCodes } from '@/utils/enum.utils';
import { IsIn, ValidationOptions } from 'class-validator';

export function IsEnumCode(
  group: Record<string, { code: string }>,
  validationOptions?: ValidationOptions,
) {
  return IsIn(enumCodes(group), {
    message: validationOptions?.message || 'Giá trị không thuộc enum hợp lệ',
    ...validationOptions,
  });
}
