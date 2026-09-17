/**
 * Barrel export cho toàn bộ modules.
 * Thứ tự export theo nhóm chức năng để dễ quản lý.
 */

/* ============================================================
 * AUTH
 * ============================================================ */
export * from './auth/auth.module';
export * from './facebook-auth/facebook-auth.module';
export * from './google-auth/google-auth.module';

/* ============================================================
 * AGGREGATOR MODULES
 * ============================================================ */
export * from './admin';
export * from './public';
export * from './user';

/* ============================================================
 * INFRASTRUCTURE
 * ============================================================ */
export * from './upload-file';
