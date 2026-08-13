import { enumData } from '@/common/constanst/enumData';
import { IsEnumCode } from '@/common/decorators';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class InvitationHostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: enumData.HOST_ROLE })
  @IsNotEmpty()
  @IsEnumCode(enumData.HOST_ROLE)
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  honorific?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  family?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class InvitationEventDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: enumData.EVENT_KEY })
  @IsNotEmpty()
  @IsEnumCode(enumData.EVENT_KEY)
  eventKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startsAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mapsUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dressCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class InvitationGiftDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class InvitationTimelineDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timeLabel?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class InvitationPhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ required: false, enum: enumData.PHOTO_KIND })
  @IsOptional()
  @IsEnumCode(enumData.PHOTO_KIND)
  kind?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class GuestGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateInvitationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiProperty({ enum: enumData.CARD_TYPE })
  @IsNotEmpty()
  @IsEnumCode(enumData.CARD_TYPE)
  cardType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  invitationText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thankYouText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hashtag?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  sectionConfig?: Record<string, boolean>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  enabledModules?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  music?: { url?: string; type?: string; autoplay?: boolean; name?: string };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  extraContent?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  customDesign?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  coverConfig?: Record<string, any>;

  @ApiProperty({ type: [InvitationHostDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationHostDto)
  hosts?: InvitationHostDto[];

  @ApiProperty({ type: [InvitationEventDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationEventDto)
  events?: InvitationEventDto[];

  @ApiProperty({ type: [InvitationGiftDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationGiftDto)
  gifts?: InvitationGiftDto[];

  @ApiProperty({ type: [InvitationTimelineDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationTimelineDto)
  timelines?: InvitationTimelineDto[];

  @ApiProperty({ type: [InvitationPhotoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationPhotoDto)
  photos?: InvitationPhotoDto[];

  @ApiProperty({ type: [GuestGroupDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestGroupDto)
  guestGroups?: GuestGroupDto[];
}

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slugReason?: string;
}

export class FilterInvitationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnumCode(enumData.CARD_TYPE)
  cardType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, enum: enumData.INVITATION_STATUS })
  @IsOptional()
  @IsEnumCode(enumData.INVITATION_STATUS)
  status?: string;
}

export class AdminForceResetSlugDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  invitationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newSlug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class CheckSlugDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;
}
