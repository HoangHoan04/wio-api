import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContactEmailData } from './dto';
import { EMAIL_BRAND } from './email.contants';
import {
  forgotPasswordTemplate,
  loginOtpTemplate,
  registerOtpTemplate,
} from './email.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly senderAddress: string;
  private readonly adminEmail: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const emailAccount =
      this.configService.get<string>('EMAIL_VALIDATE_ACCOUNT') || '';
    const emailPassword =
      this.configService.get<string>('EMAIL_VALIDATE_PASSWORD') || '';

    if (!emailAccount || !emailPassword) {
      throw new InternalServerErrorException(
        'Thiếu cấu hình EMAIL_VALIDATE_ACCOUNT hoặc EMAIL_VALIDATE_PASSWORD',
      );
    }

    this.senderAddress = emailAccount;
    this.adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || emailAccount;
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3011';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: Number(this.configService.get<string>('SMTP_PORT')) || 587,
      secure: false,
      auth: { user: emailAccount, pass: emailPassword },
    });
  }

  /* ============================================================
   * PRIVATE HELPER — Gửi mail
   * ============================================================ */
  private async sendMail(params: {
    to: string;
    subject: string;
    html: string;
    fromName?: string;
    replyTo?: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${params.fromName || EMAIL_BRAND.NAME}" <${this.senderAddress}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
        replyTo: params.replyTo,
      });
    } catch (error: any) {
      this.logger.error(`Gửi mail thất bại tới ${params.to}: ${error.message}`);
      throw new InternalServerErrorException('Không thể gửi email');
    }
  }

  /* ============================================================
   * OTP EMAILS
   * ============================================================ */
  async sendEmailVerify(data: {
    email: string;
    otpCode: string;
  }): Promise<boolean> {
    await this.sendMail({
      to: data.email,
      subject: `[${EMAIL_BRAND.NAME}] Mã xác thực đăng ký tài khoản`,
      html: registerOtpTemplate(data.otpCode),
    });
    return true;
  }

  async sendEmailForgotPassword(data: {
    email: string;
    otpCode: string;
  }): Promise<boolean> {
    await this.sendMail({
      to: data.email,
      subject: `[${EMAIL_BRAND.NAME}] Khôi phục mật khẩu tài khoản`,
      html: forgotPasswordTemplate(data.otpCode),
    });
    return true;
  }

  async sendLoginOtp(data: {
    email: string;
    otpCode: string;
  }): Promise<boolean> {
    const loginLink = `${this.frontendUrl}/login-otp?email=${encodeURIComponent(
      data.email,
    )}&otp=${data.otpCode}`;

    await this.sendMail({
      to: data.email,
      subject: `[${EMAIL_BRAND.NAME}] Mã OTP đăng nhập hệ thống`,
      html: loginOtpTemplate({
        email: data.email,
        otpCode: data.otpCode,
        loginLink,
      }),
    });
    return true;
  }

  /* ============================================================
   * CONTACT EMAILS
   * ============================================================ */
  async sendContactToAdmin(data: ContactEmailData): Promise<boolean> {
    await this.sendMail({
      fromName: `${EMAIL_BRAND.NAME} Contact`,
      to: this.adminEmail,
      subject: `Liên hệ mới từ ${data.name} - ${data.subject || 'Không có chủ đề'}`,
      html: this.getContactToAdminTemplate(data),
      replyTo: data.email,
    });
    return true;
  }

  async sendContactConfirmation(data: ContactEmailData): Promise<boolean> {
    try {
      await this.sendMail({
        fromName: `${EMAIL_BRAND.NAME} Support`,
        to: data.email,
        subject: `Xác nhận đã nhận liên hệ của bạn - ${EMAIL_BRAND.NAME}`,
        html: this.getContactConfirmationTemplate(data),
      });
      return true;
    } catch (error) {
      // Confirmation thất bại không chặn luồng chính (chỉ log)
      this.logger.warn(`Không gửi được email xác nhận tới ${data.email}`);
      return false;
    }
  }

  /* ============================================================
   * CONTACT TEMPLATES (giữ đơn giản — không dùng brand InviGo)
   * ============================================================ */
  private getContactToAdminTemplate(data: ContactEmailData): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Liên hệ mới</title></head>
      <body style="background-color: #f3f4f6; font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; padding: 30px;">
          <h2 style="color: #1f2937;">📧 Liên hệ mới</h2>
          <p><strong>Họ tên:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Chủ đề:</strong> ${data.subject || 'Không có'}</p>
          <p><strong>Nội dung:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${data.message}</div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">© ${currentYear} ${EMAIL_BRAND.NAME}</p>
        </div>
      </body>
      </html>
    `;
  }

  private getContactConfirmationTemplate(data: ContactEmailData): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Xác nhận liên hệ</title></head>
      <body style="background-color: #f3f4f6; font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; padding: 30px;">
          <h2 style="color: #10b981;">✅ Đã nhận tin nhắn của bạn</h2>
          <p>Xin chào <strong>${data.name}</strong>,</p>
          <p>Cảm ơn bạn đã liên hệ với ${EMAIL_BRAND.NAME}. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46; font-style: italic;">"${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}"</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            📞 Hotline: <strong>${EMAIL_BRAND.HOTLINE}</strong>
          </p>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
            Trân trọng,<br><strong>${EMAIL_BRAND.NAME}</strong><br>
            © ${currentYear} ${EMAIL_BRAND.NAME}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
