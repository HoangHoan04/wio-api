import { ApiProperty } from '@nestjs/swagger';

export class BaseDto<T, T1> {
  t: T;
  t1: T1;
}

export class FilterBaseDto {
  @ApiProperty({ description: 'Trạng thái xóa mềm' })
  isDeleted?: boolean;
}
