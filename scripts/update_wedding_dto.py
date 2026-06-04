import re

file_path = r'f:\Projects\wio\wio-api\src\modules\wedding\dto\index.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_dto_fields = """
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  displayOrder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showHeroImage?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroImageMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showIntro?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGallery?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  galleryLayout?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showParty?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partyType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receptionWelcomeTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showCountdown?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showMap?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showDressCode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  dressCodes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showTimeline?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timelineTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showRsvp?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rsvpType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGuestbook?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookStatic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookFloating?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showThankYou?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thankYouText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  musicName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  events?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  timelines?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  gallery?: string[];
"""

# Insert new fields into CreateWeddingDto and FilterWeddingDto
content = content.replace("  expiresAt?: Date;\n}\n\nexport class UpdateWeddingDto", new_dto_fields + "\n  expiresAt?: Date;\n}\n\nexport class UpdateWeddingDto")

content = content.replace("  expiresAt?: Date;\n}\n\n// --- Admin specific DTOs ---", new_dto_fields + "\n  expiresAt?: Date;\n}\n\n// --- Admin specific DTOs ---")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated dto/index.ts")
