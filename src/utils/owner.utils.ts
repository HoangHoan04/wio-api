import { enumData } from '@/common/constanst/enumData';
import { ForbiddenException } from '@nestjs/common';
import { UserDto } from '@/dto';

export function isAdminUser(user?: Pick<UserDto, 'isAdmin'> & { role?: string }): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  return user.role === enumData.USER_ROLE.ADMIN.code;
}

export function assertOwner(
  user: UserDto,
  ownerId: string,
  message = 'Bạn không có quyền thực hiện thao tác này',
) {
  if (isAdminUser(user)) return;
  if (user.id !== ownerId) {
    throw new ForbiddenException(message);
  }
}
