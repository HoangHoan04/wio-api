import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ActionLogFilterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  entityName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  actionType: string;

  @ApiProperty({ required: true })
  @IsOptional()
  createdByName: string;
}

export class ActionLogCreateDto {
  @ApiProperty({ description: 'ID người dùng thực hiện hành động' })
  @IsNotEmpty()
  createdById: string;

  @ApiProperty({ description: 'Mã người dùng thực hiện hành động' })
  @IsNotEmpty()
  createdByCode: string;

  @ApiProperty({ description: 'Tên người dùng thực hiện hành động' })
  @IsNotEmpty()
  createdByName: string;

  @ApiProperty({ description: 'Ghi chú bổ sung về hành động' })
  @IsOptional()
  createdNote?: string;

  @ApiProperty({
    description: 'Loại hành động: Login | CreateExam | SubmitExam...',
  })
  @IsOptional()
  actionType?: string;

  @ApiProperty({ description: 'ID thực thể bị tác động' })
  @IsOptional()
  entityId?: string;

  @ApiProperty({ description: 'Tên bảng thực thể bị tác động' })
  @IsOptional()
  entityName?: string;

  @ApiProperty({ description: 'Lưu trữ giá trị cũ dưới dạng JSON' })
  @IsOptional()
  oldValue?: any;

  @ApiProperty({ description: 'Lưu trữ giá trị mới dưới dạng JSON' })
  @IsOptional()
  newValue?: any;

  @ApiProperty({ description: 'Địa chỉ IP của người dùng' })
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ description: 'User agent string của trình duyệt' })
  @IsOptional()
  userAgent?: string;

  @ApiProperty({ description: 'Vị trí địa lý ước tính' })
  @IsOptional()
  location?: string;
}
