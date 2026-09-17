import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendContactDto, SendOtpEmailDto } from './dto';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('send-verify-email')
  @ApiOperation({ summary: 'Gửi email xác thực đăng ký tài khoản' })
  async sendVerify(@Body() data: SendOtpEmailDto) {
    return this.service.sendEmailVerify(data);
  }

  @Post('send-forgot-password-email')
  @ApiOperation({ summary: 'Gửi email quên mật khẩu' })
  async sendForgotPassword(@Body() data: SendOtpEmailDto) {
    return this.service.sendEmailForgotPassword(data);
  }

  @Post('send-contact')
  @ApiOperation({ summary: 'Gửi email liên hệ tới admin + xác nhận user' })
  async sendContact(@Body() data: SendContactDto) {
    await this.service.sendContactToAdmin(data);
    await this.service.sendContactConfirmation(data);

    return {
      success: true,
      message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.',
    };
  }
}
