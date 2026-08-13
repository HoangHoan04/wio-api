import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { enumData } from '@/common/constanst/enumData';
import { ContactEmailData } from './dto';

const BRAND_NAME = enumData.BRAND.NAME.name;
const BRAND_TAGLINE = enumData.BRAND.TAGLINE.name;

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private senderAddress: string;
  private adminEmail: string;

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

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailAccount,
        pass: emailPassword,
      },
    });
  }

  async sendEmailVerify(data: {
    email?: string;
    otpCode: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${BRAND_NAME}" <${this.senderAddress}>`,
        to: data.email,
        subject: '[WIO] Mã xác thực đăng ký tài khoản',
        html: this.getOtpEmailTemplate(data.otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new InternalServerErrorException('Không thể gửi email xác thực');
    }
  }

  async sendEmailForgotPassword(data: {
    email?: string;
    otpCode: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${BRAND_NAME}" <${this.senderAddress}>`,
        to: data.email,
        subject: '[WIO] Khôi phục mật khẩu tài khoản',
        html: this.getForgotPasswordTemplate(data.otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email khôi phục mật khẩu',
      );
    }
  }

  async sendLoginOtp(data: {
    email: string;
    otpCode: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${BRAND_NAME}" <${this.senderAddress}>`,
        to: data.email,
        subject: '[WIO] Mã OTP đăng nhập hệ thống',
        html: this.getLoginOtpTemplate(data.email, data.otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending login OTP email:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực đăng nhập',
      );
    }
  }

  private getOtpEmailTemplate(otpCode: string): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực tài khoản ${BRAND_NAME}</title>
        <style>
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        </style>
      </head>
      <body style="background-color: #1a0a0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 10px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #251218; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <div style="text-align: center; padding: 40px 0; background-color: #1a0a0f; border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
             <h1 style="color: #f5c842; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 2px;">${BRAND_NAME}</h1>
             <p style="color: #f5e6d3; font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; letter-spacing: 4px; text-transform: uppercase;">${BRAND_TAGLINE}</p>
          </div>

          <div style="padding: 40px 30px; background-color: #251218;">
            
            <h2 style="color: #f5c842; text-align: center; font-size: 22px; font-weight: 500; margin-bottom: 30px; font-family: Georgia, serif;">Xác Thực Tài Khoản Đăng Ký</h2>

            <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
              Xin chào,<br>Cảm ơn bạn đã lựa chọn ${BRAND_NAME} để kiến tạo ngày chung đôi. Vui lòng sử dụng mã OTP dưới đây để hoàn tất đăng ký tài khoản:
            </p>

            <div style="background-color: rgba(26, 10, 15, 0.6); border: 1px dashed #d4af37; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="display: block; color: rgba(245, 230, 211, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã OTP của bạn</span>
              <div style="color: #f5c842; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace; text-shadow: 0 0 10px rgba(245, 200, 66, 0.3);">${otpCode}</div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 15px; margin-top: 25px;">
              <tr>
                <td width="30" valign="top" style="font-size: 20px; padding-right: 10px;">🛡️</td>
                <td>
                  <p style="margin: 0; color: #f5e6d3; font-size: 13px; line-height: 1.5; opacity: 0.9;">
                    <strong>Lưu ý bảo mật:</strong> Mã này sẽ hết hạn sau <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này với bất kỳ ai để bảo vệ quyền sở hữu thiệp cưới của bạn.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color: rgba(245, 230, 211, 0.7); font-size: 14px; text-align: center; margin-top: 40px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #f5c842; font-family: Georgia, serif; font-size: 15px;">Đội ngũ ${BRAND_NAME}</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center; background-color: #1a0a0f; border-top: 1px solid rgba(212, 175, 55, 0.15);">
            <p style="color: rgba(245, 230, 211, 0.5); font-size: 12px; margin-bottom: 10px;">
              Bạn nhận được email này vì đã yêu cầu đăng ký tại ${BRAND_NAME}.
            </p>
            
            <div style="margin: 20px 0; border-top: 1px solid rgba(212, 175, 55, 0.15); width: 100%;"></div>

            <p style="color: rgba(245, 230, 211, 0.7); font-size: 12px; line-height: 1.6;">
              <strong>HỆ THỐNG THIỆP CƯỚI TRỰC TUYẾN — TIỆM CƯỚI TÂN THỜI</strong><br>
              📞 Hotline: 1900 123 456 | 📧 Email: hello@wio.vn<br>
              🌐 Website: <a href="http://localhost:3011" style="color: #f5c842; text-decoration: none;">wio.vn</a>
            </p>

            <p style="color: rgba(245, 230, 211, 0.4); font-size: 11px; margin-top: 20px;">
              © ${currentYear} ${BRAND_NAME}. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  private getForgotPasswordTemplate(otpCode: string): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Khôi phục mật khẩu ${BRAND_NAME}</title>
        <style>
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        </style>
      </head>
      <body style="background-color: #1a0a0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 10px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #251218; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <div style="text-align: center; padding: 40px 0; background-color: #1a0a0f; border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
             <h1 style="color: #f5c842; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 2px;">${BRAND_NAME}</h1>
             <p style="color: #f5e6d3; font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; letter-spacing: 4px; text-transform: uppercase;">${BRAND_TAGLINE}</p>
          </div>

          <div style="padding: 40px 30px; background-color: #251218;">
            
            <h2 style="color: #f5c842; text-align: center; font-size: 22px; font-weight: 500; margin-bottom: 30px; font-family: Georgia, serif;">Khôi Phục Mật Khẩu</h2>

            <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
              Chúng tôi đã nhận được yêu cầu cài đặt lại mật khẩu của bạn. Vui lòng sử dụng mã OTP bên dưới để tiếp tục quá trình khôi phục:
            </p>

            <div style="background-color: rgba(26, 10, 15, 0.6); border: 1px dashed #d4af37; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="display: block; color: rgba(245, 230, 211, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã OTP khôi phục</span>
              <div style="color: #f5c842; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace; text-shadow: 0 0 10px rgba(245, 200, 66, 0.3);">${otpCode}</div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 15px; margin-top: 25px;">
              <tr>
                <td width="30" valign="top" style="font-size: 20px; padding-right: 10px;">⚠️</td>
                <td>
                  <p style="margin: 0; color: #f5e6d3; font-size: 13px; line-height: 1.5; opacity: 0.9;">
                    <strong>Lưu ý:</strong> Mã này chỉ có hiệu lực trong vòng <strong>5 phút</strong>. Nếu không yêu cầu đặt lại mật khẩu, bạn có thể an tâm bỏ qua email này.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color: rgba(245, 230, 211, 0.7); font-size: 14px; text-align: center; margin-top: 40px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #f5c842; font-family: Georgia, serif; font-size: 15px;">Đội ngũ bảo mật ${BRAND_NAME}</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center; background-color: #1a0a0f; border-top: 1px solid rgba(212, 175, 55, 0.15);">
            <p style="color: rgba(245, 230, 211, 0.7); font-size: 12px; line-height: 1.6;">
              <strong>HỆ THỐNG THIỆP CƯỚI TRỰC TUYẾN — TIỆM CƯỚI TÂN THỜI</strong><br>
              📞 Hotline: 1900 123 456 | 📧 Email: hello@wio.vn<br>
              🌐 Website: <a href="http://localhost:3011" style="color: #f5c842; text-decoration: none;">wio.vn</a>
            </p>
            <p style="color: rgba(245, 230, 211, 0.4); font-size: 11px; margin-top: 20px;">
              © ${currentYear} ${BRAND_NAME}. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  private getLoginOtpTemplate(email: string, otpCode: string): string {
    const currentYear = new Date().getFullYear();
    const loginLink = `http://localhost:3011/login-otp?email=${encodeURIComponent(email)}&otp=${otpCode}`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã OTP Đăng Nhập ${BRAND_NAME}</title>
        <style>
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        </style>
      </head>
      <body style="background-color: #1a0a0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 10px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #251218; border: 1px solid #d4af37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <div style="text-align: center; padding: 40px 0; background-color: #1a0a0f; border-bottom: 1px solid rgba(212, 175, 55, 0.25);">
             <h1 style="color: #f5c842; font-size: 28px; margin: 0; font-family: Georgia, serif; letter-spacing: 2px;">${BRAND_NAME}</h1>
             <p style="color: #f5e6d3; font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; letter-spacing: 4px; text-transform: uppercase;">${BRAND_TAGLINE}</p>
          </div>

          <div style="padding: 40px 30px; background-color: #251218;">
            
            <h2 style="color: #f5c842; text-align: center; font-size: 22px; font-weight: 500; margin-bottom: 30px; font-family: Georgia, serif;">Mã Xác Thực Đăng Nhập (OTP)</h2>

            <p style="color: #f5e6d3; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
              Xin chào,<br>Bạn đang thực hiện đăng nhập vào hệ thống quản lý thiệp cưới của ${BRAND_NAME}. Vui lòng nhập mã OTP dưới đây hoặc bấm nút phía dưới để đăng nhập tự động:
            </p>

            <div style="background-color: rgba(26, 10, 15, 0.6); border: 1px dashed #d4af37; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="display: block; color: rgba(245, 230, 211, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã OTP của bạn</span>
              <div style="color: #f5c842; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace; text-shadow: 0 0 10px rgba(245, 200, 66, 0.3); margin-bottom: 25px;">${otpCode}</div>
              
              <div style="margin-top: 20px; margin-bottom: 10px;">
                <a href="${loginLink}" style="display: inline-block; background: linear-gradient(90deg, #d4af37, #f5c842); color: #1a0a0f; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); letter-spacing: 0.5px;">
                  XÁC NHẬN & ĐĂNG NHẬP NGAY
                </a>
              </div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; padding: 15px; margin-top: 25px;">
              <tr>
                <td width="30" valign="top" style="font-size: 20px; padding-right: 10px;">🔒</td>
                <td>
                  <p style="margin: 0; color: #f5e6d3; font-size: 13px; line-height: 1.5; opacity: 0.9;">
                    <strong>Bảo mật:</strong> Mã này có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai để bảo đảm an toàn thông tin tài khoản.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color: rgba(245, 230, 211, 0.7); font-size: 14px; text-align: center; margin-top: 40px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #f5c842; font-family: Georgia, serif; font-size: 15px;">Đội ngũ ${BRAND_NAME}</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center; background-color: #1a0a0f; border-top: 1px solid rgba(212, 175, 55, 0.15);">
            <p style="color: rgba(245, 230, 211, 0.7); font-size: 12px; line-height: 1.6;">
              <strong>HỆ THỐNG THIỆP CƯỚI TRỰC TUYẾN — TIỆM CƯỚI TÂN THỜI</strong><br>
              📞 Hotline: 1900 123 456 | 📧 Email: hello@wio.vn<br>
              🌐 Website: <a href="http://localhost:3011" style="color: #f5c842; text-decoration: none;">wio.vn</a>
            </p>
            <p style="color: rgba(245, 230, 211, 0.4); font-size: 11px; margin-top: 20px;">
              © ${currentYear} ${BRAND_NAME}. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  async sendContactToAdmin(data: ContactEmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"HimLamTourist Contact" <${this.senderAddress}>`,
        to: this.adminEmail,
        subject: `Liên hệ mới từ ${data.name} - ${data.subject || 'Không có chủ đề'}`,
        html: this.getContactToAdminTemplate(data),
        replyTo: data.email,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending contact email to admin:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email liên hệ đến admin',
      );
    }
  }

  async sendContactConfirmation(data: ContactEmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"HimLamTourist Support" <${this.senderAddress}>`,
        to: data.email,
        subject: 'Xác nhận đã nhận liên hệ của bạn - HimLamTourist',
        html: this.getContactConfirmationTemplate(data),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending contact confirmation:', error);
      return false;
    }
  }

  private getContactToAdminTemplate(data: ContactEmailData): string {
    const currentYear = new Date().getFullYear();
    const subjectLabels: { [key: string]: string } = {
      general: 'Câu hỏi chung',
      support: 'Hỗ trợ',
      feedback: 'Phản hồi',
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Liên hệ mới từ học viên</title>
      </head>
      <body style="background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">📧 Liên hệ mới từ học viên</h1>
          </div>

          <div style="padding: 30px;">
            
            <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Thông tin người gửi</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;"><strong>👤 Họ tên:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>📧 Email:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                    <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>📋 Chủ đề:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${data.subject ? subjectLabels[data.subject] || data.subject : 'Không có'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>🕐 Thời gian:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${new Date().toLocaleString('vi-VN')}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">💬 Nội dung tin nhắn:</h3>
              <div style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
            </div>

            <div style="margin-top: 25px; padding: 15px; background-color: #eff6ff; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #1e40af; font-size: 13px;">
                💡 <strong>Lưu ý:</strong> Bạn có thể trả lời trực tiếp email này, tin nhắn sẽ được gửi tới ${data.email}
              </p>
            </div>

          </div>

          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Email tự động từ hệ thống HimLamTourist<br>
              © ${currentYear} HimLamTourist. All rights reserved.
            </p>
          </div>

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
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận liên hệ - HimLamTourist</title>
      </head>
      <body style="background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
       

          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; margin: 0 20px;">
            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px auto; line-height: 60px;">
              <span style="font-size: 30px;">✅</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Đã nhận tin nhắn của bạn!</h1>
          </div>

          <div style="padding: 40px 30px; margin: 0 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 20px 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Xin chào <strong>${data.name}</strong>,
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Cảm ơn bạn đã liên hệ với HimLamTourist! Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
            </p>

            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; color: #065f46; font-size: 14px; font-weight: 600;">📝 Nội dung bạn đã gửi:</p>
              <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6; font-style: italic; white-space: pre-wrap;">"${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}"</p>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 25px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40" valign="top" style="font-size: 24px;">⏱️</td>
                  <td>
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                      <strong>Thời gian phản hồi:</strong><br>
                      Đội ngũ hỗ trợ của chúng tôi thường phản hồi trong vòng <strong>24 giờ làm việc</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 0; text-align: center;">
              Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ:<br>
              📞 Hotline: <strong style="color: #667eea;">1900 123 456</strong>
            </p>

            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #4b5563;">Đội ngũ HimLamTourist</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
              <strong>CÔNG TY TNHH HimLamTourist VIỆT NAM</strong><br>
              🏢 Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh<br>
              📞 Hotline: 1900 123 456 | 📧 Email: support@HimLamTourist.com<br>
              🌐 Website: <a href="https://HimLamTourist.com" style="color: #667eea; text-decoration: none;">www.HimLamTourist.com</a>
            </p>
            
            <p style="color: #d1d5db; font-size: 11px; margin-top: 20px;">
              © ${currentYear} HimLamTourist. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  async sendNewsletterWelcome(email: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"HimLamTourist Newsletter" <${this.senderAddress}>`,
        to: email,
        subject: '🎉 Chào mừng bạn đến với HimLamTourist Newsletter!',
        html: this.getNewsletterWelcomeTemplate(email),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending newsletter welcome email:', error);
      return false;
    }
  }

  private getNewsletterWelcomeTemplate(email: string): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với HimLamTourist Newsletter</title>
      </head>
      <body style="background-color: #f0fdf4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px auto; line-height: 80px;">
              <span style="font-size: 40px;">🎉</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Chào mừng bạn!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">Cảm ơn bạn đã đăng ký nhận tin từ HimLamTourist</p>
          </div>

          <div style="padding: 40px 30px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0;">
                Xin chào <strong style="color: #10b981;">${email}</strong>,<br><br>
                Chúc mừng bạn đã trở thành thành viên của HimLamTourist Newsletter! 🌟<br>
                Từ giờ bạn sẽ nhận được:
              </p>
            </div>

            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <div style="margin-bottom: 15px;">
                <span style="font-size: 20px; margin-right: 10px;">✈️</span>
                <strong style="color: #065f46; font-size: 15px;">Ưu đãi du lịch độc quyền</strong>
                <p style="color: #059669; font-size: 14px; margin: 5px 0 0 30px; line-height: 1.5;">Giảm giá đặc biệt dành riêng cho người đăng ký</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <span style="font-size: 20px; margin-right: 10px;">🏖️</span>
                <strong style="color: #065f46; font-size: 15px;">Tour mới nhất & hấp dẫn nhất</strong>
                <p style="color: #059669; font-size: 14px; margin: 5px 0 0 30px; line-height: 1.5;">Cập nhật các điểm đến hot nhất</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <span style="font-size: 20px; margin-right: 10px;">💰</span>
                <strong style="color: #065f46; font-size: 15px;">Flash sale & combo tiết kiệm</strong>
                <p style="color: #059669; font-size: 14px; margin: 5px 0 0 30px; line-height: 1.5;">Ưu đãi trong thời gian giới hạn</p>
              </div>
              
              <div>
                <span style="font-size: 20px; margin-right: 10px;">📰</span>
                <strong style="color: #065f46; font-size: 15px;">Tin tức & cẩm nang du lịch</strong>
                <p style="color: #059669; font-size: 14px; margin: 5px 0 0 30px; line-height: 1.5;">Kinh nghiệm và mẹo hay cho chuyến đi</p>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                <strong>🎁 Quà tặng chào mừng!</strong><br>
                Sử dụng mã <strong style="font-size: 18px; color: #b45309;">WELCOME10</strong> để nhận<br>
                <span style="font-size: 20px; font-weight: 700; color: #b45309;">GIẢM 10%</span> cho tour đầu tiên!
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://HimLamTourist.com/tours" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                🌍 Khám phá Tour ngay
              </a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.6;">
                Bạn muốn hủy đăng ký? Thật tiếc! Bạn có thể <a href="https://HimLamTourist.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #10b981; text-decoration: none;">hủy đăng ký tại đây</a>
              </p>
            </div>

          </div>

          <div style="padding: 30px 20px; text-align: center; background-color: #f9fafb;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin-bottom: 15px;">
              <strong>CÔNG TY TNHH HimLamTourist VIỆT NAM</strong><br>
              🏢 Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh<br>
              📞 Hotline: 1900 123 456 | 📧 Email: support@HimLamTourist.com<br>
              🌐 Website: <a href="https://HimLamTourist.com" style="color: #10b981; text-decoration: none;">www.HimLamTourist.com</a>
            </p>
            
            <div style="margin: 15px 0;">
              <a href="#" style="margin: 0 8px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" alt="Facebook">
              </a>
              <a href="#" style="margin: 0 8px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" alt="Instagram">
              </a>
              <a href="#" style="margin: 0 8px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="24" alt="YouTube">
              </a>
            </div>
            
            <p style="color: #d1d5db; font-size: 11px; margin-top: 15px;">
              © ${currentYear} HimLamTourist. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }
}
