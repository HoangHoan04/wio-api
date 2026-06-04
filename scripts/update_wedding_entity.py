import re

file_path = r'f:\Projects\wio\wio-api\src\entities\wedding.entity.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports for new entities
content = content.replace("import { WeddingPhotoEntity } from './wedding-photo.entity';", "import { WeddingPhotoEntity } from './wedding-photo.entity';\nimport { WeddingEventEntity } from './wedding-event.entity';\nimport { WeddingTimelineEntity } from './wedding-timeline.entity';")

# Add new columns after slug
new_columns = """
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Thứ tự hiển thị: groom_first | bride_first', required: false })
  displayOrder: string;

  @Column({ type: 'boolean', default: true })
  showHeroImage: boolean;

  @Column({ type: 'text', nullable: true })
  heroImageMain: string;

  @Column({ type: 'boolean', default: true })
  showIntro: boolean;

  @Column({ type: 'boolean', default: true })
  showGallery: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  galleryLayout: string;

  @Column({ type: 'boolean', default: true })
  showParty: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  partyType: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  receptionWelcomeTime: string;

  @Column({ type: 'boolean', default: true })
  showCountdown: boolean;

  @Column({ type: 'boolean', default: true })
  showMap: boolean;

  @Column({ type: 'boolean', default: true })
  showDressCode: boolean;

  @Column({ type: 'jsonb', nullable: true })
  dressCodes: string[];

  @Column({ type: 'boolean', default: true })
  showTimeline: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timelineTitle: string;

  @Column({ type: 'boolean', default: true })
  showRsvp: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rsvpType: string;

  @Column({ type: 'boolean', default: true })
  showGuestbook: boolean;

  @Column({ type: 'boolean', default: true })
  guestbookStatic: boolean;

  @Column({ type: 'boolean', default: true })
  guestbookFloating: boolean;

  @Column({ type: 'boolean', default: true })
  showThankYou: boolean;

  @Column({ type: 'text', nullable: true })
  thankYouText: string;
"""
content = content.replace("  // --- Thông tin cô dâu chú rể ---", new_columns + "\n  // --- Thông tin cô dâu chú rể ---")

# Replace groom fields
content = content.replace("  @Column({ type: 'varchar', length: 100, nullable: false })\n  @ApiProperty({ description: 'Tên chú rể' })\n  groomName: string;", 
"""  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên chú rể' })
  groomName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  groomShortName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  groomTitle: string;

  @Column({ type: 'text', nullable: true })
  groomAddress: string;""")

# Replace bride fields
content = content.replace("  @Column({ type: 'varchar', length: 100, nullable: false })\n  @ApiProperty({ description: 'Tên cô dâu' })\n  brideName: string;", 
"""  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên cô dâu' })
  brideName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brideShortName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brideTitle: string;

  @Column({ type: 'text', nullable: true })
  brideAddress: string;""")

# Replace bank fields
content = content.replace("""  // --- Thanh toán / Mừng cưới ---
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Số tài khoản ngân hàng', required: false })
  bankAccountNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  bankName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên chủ tài khoản', required: false })
  bankAccountName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Nội dung chuyển khoản mẫu', required: false })
  bankTransferNote: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'URL ảnh QR sinh tự động', required: false })
  vietqrUrl: string;""", """  // --- Thanh toán / Mừng cưới ---
  @Column({ type: 'varchar', length: 50, nullable: true })
  groomBankAccount: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  groomBankName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  groomBankOwner: string;

  @Column({ type: 'text', nullable: true })
  groomQrUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brideBankAccount: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brideBankName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brideBankOwner: string;

  @Column({ type: 'text', nullable: true })
  brideQrUrl: string;""")

# Add musicName
content = content.replace("  musicAutoplay: boolean;", "  musicAutoplay: boolean;\n\n  @Column({ type: 'varchar', length: 255, nullable: true })\n  musicName: string;")

# Add relations
relations = """
  @OneToMany(() => WeddingEventEntity, (event) => event.wedding)
  events: WeddingEventEntity[];

  @OneToMany(() => WeddingTimelineEntity, (timeline) => timeline.wedding)
  timelines: WeddingTimelineEntity[];
"""
content = content.replace("  @OneToMany(() => WeddingPhotoEntity, (photo) => photo.wedding)\n  photos: WeddingPhotoEntity[];", "  @OneToMany(() => WeddingPhotoEntity, (photo) => photo.wedding)\n  photos: WeddingPhotoEntity[];\n" + relations)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated wedding.entity.ts")
