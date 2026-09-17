import { EMAIL_BRAND } from './email.contants';

/* ============================================================
 * HELPER: Layout chung cho email InviGo
 * ============================================================ */
export function invigoLayout(params: {
  title: string;
  heading: string;
  body: string;
}): string {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${params.title}</title>
    </head>
    <body style="background-color: #1a0a0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 10px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #251218; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        <div style="text-align: center; padding: 40px 0; background-color: #1a0a0f; border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
          <h1 style="color: #f5c842; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 2px;">${EMAIL_BRAND.NAME}</h1>
          <p style="color: #f5e6d3; font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; letter-spacing: 4px; text-transform: uppercase;">${EMAIL_BRAND.TAGLINE}</p>
        </div>
        <div style="padding: 40px 30px; background-color: #251218;">
          <h2 style="color: #f5c842; text-align: center; font-size: 22px; font-weight: 500; margin-bottom: 30px; font-family: Georgia, serif;">${params.heading}</h2>
          ${params.body}
        </div>
        <div style="padding: 30px 20px; text-align: center; background-color: #1a0a0f; border-top: 1px solid rgba(212, 175, 55, 0.15);">
          <p style="color: rgba(245, 230, 211, 0.7); font-size: 12px; line-height: 1.6;">
            <strong>${EMAIL_BRAND.COMPANY_NAME}</strong><br>
            📞 Hotline: ${EMAIL_BRAND.HOTLINE} | 📧 Email: ${EMAIL_BRAND.SUPPORT_EMAIL}<br>
            🌐 Website: <a href="${EMAIL_BRAND.WEBSITE}" style="color: #f5c842; text-decoration: none;">${EMAIL_BRAND.WEBSITE}</a>
          </p>
          <p style="color: rgba(245, 230, 211, 0.4); font-size: 11px; margin-top: 20px;">
            © ${currentYear} ${EMAIL_BRAND.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/* ============================================================
 * OTP BLOCK — dùng chung cho nhiều template
 * ============================================================ */
export function otpBlock(params: {
  label: string;
  otpCode: string;
  buttonLink?: string;
  buttonLabel?: string;
}): string {
  return `
    <div style="background-color: rgba(26, 10, 15, 0.6); border: 1px dashed #d4af37; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
      <span style="display: block; color: rgba(245, 230, 211, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">${params.label}</span>
      <div style="color: #f5c842; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace; text-shadow: 0 0 10px rgba(245, 200, 66, 0.3);">
        ${params.otpCode}
      </div>
      ${
        params.buttonLink
          ? `
        <div style="margin-top: 20px;">
          <a href="${params.buttonLink}" style="display: inline-block; background: linear-gradient(90deg, #d4af37, #f5c842); color: #1a0a0f; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
            ${params.buttonLabel || 'XÁC NHẬN'}
          </a>
        </div>
      `
          : ''
      }
    </div>
  `;
}

/* ============================================================
 * TEMPLATES
 * ============================================================ */
export function registerOtpTemplate(otpCode: string): string {
  return invigoLayout({
    title: 'Xác thực tài khoản',
    heading: 'Xác Thực Tài Khoản Đăng Ký',
    body: `
      <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
        Xin chào,<br>Cảm ơn bạn đã lựa chọn ${EMAIL_BRAND.NAME}. Vui lòng sử dụng mã OTP dưới đây để hoàn tất đăng ký tài khoản:
      </p>
      ${otpBlock({ label: 'Mã OTP của bạn', otpCode })}
    `,
  });
}

export function forgotPasswordTemplate(otpCode: string): string {
  return invigoLayout({
    title: 'Khôi phục mật khẩu',
    heading: 'Khôi Phục Mật Khẩu',
    body: `
      <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
        Chúng tôi đã nhận được yêu cầu cài đặt lại mật khẩu của bạn. Vui lòng sử dụng mã OTP bên dưới để tiếp tục:
      </p>
      ${otpBlock({ label: 'Mã OTP khôi phục', otpCode })}
    `,
  });
}

export function loginOtpTemplate(params: {
  email: string;
  otpCode: string;
  loginLink: string;
}): string {
  return invigoLayout({
    title: 'Mã OTP đăng nhập',
    heading: 'Mã Xác Thực Đăng Nhập (OTP)',
    body: `
      <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
        Xin chào,<br>Bạn đang đăng nhập vào hệ thống ${EMAIL_BRAND.NAME}. Vui lòng nhập mã OTP hoặc bấm nút bên dưới:
      </p>
      ${otpBlock({
        label: 'Mã OTP của bạn',
        otpCode: params.otpCode,
        buttonLink: params.loginLink,
        buttonLabel: 'XÁC NHẬN & ĐĂNG NHẬP NGAY',
      })}
    `,
  });
}
