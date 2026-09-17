/**
 * Prefix cho các module trong hệ thống.
 *
 * - `admin`  : prefix các route admin       →  /admin/...
 * - `user`   : prefix các route user        →  /user/...
 * - `public` : prefix các route công khai   →  /public/...  (không cần auth)
 * - `upload` : prefix các route upload      →  /upload/...
 */
export const PREFIX_MODULE = {
  admin: 'admin',
  user: 'user',
  public: 'public',
  upload: 'upload',
} as const;
