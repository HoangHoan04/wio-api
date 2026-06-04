export enum UserRole {
  COUPLE = 'couple',
  ADMIN = 'admin',
}

export enum WeddingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum MusicType {
  UPLOAD = 'upload',
  YOUTUBE = 'youtube',
  SPOTIFY = 'spotify',
}

export enum GuestSide {
  GROOM = 'groom',
  BRIDE = 'bride',
  BOTH = 'both',
}

export enum RsvpStatus {
  PENDING = 'pending',
  ATTENDING = 'attending',
  DECLINED = 'declined',
}

export enum DietaryPref {
  NORMAL = 'normal',
  VEGETARIAN = 'vegetarian',
  HALAL = 'halal',
  OTHER = 'other',
}

export enum NotifChannel {
  ZALO = 'zalo',
  SMS = 'sms',
  EMAIL = 'email',
}

export enum NotifType {
  INVITE = 'invite',
  REMINDER = 'reminder',
  THANK_YOU = 'thank_you',
  RSVP_CONFIRM = 'rsvp_confirm',
}

export enum NotifStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum SubStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
