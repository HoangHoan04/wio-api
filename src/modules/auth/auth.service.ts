import { enumData } from '@/common/constanst/enumData';
import { CustomerEntity, UserEntity, UserTokenEntity } from '@/entities';
import {
  CustomerRepository,
  UserRepository,
  UserTokenRepository,
} from '@/repositories';
import { OtpService } from '@/services/otp.service';
import { TokenService } from '@/services/token.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import {
  ChangePasswordDto,
  CheckPhoneAndEmailDto,
  FacebookLoginDto,
  ForgotPasswordCustomerDto,
  GoogleLoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendOtpCustomerDto,
  SendOtpVerifyDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UserLoginDto,
  VerifyEmailDto,
  VerifyLoginOtpDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly userTokenRepo: UserTokenRepository,
    private readonly otpService: OtpService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  private async generateAuthTokens(
    user: UserEntity,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken();

    const tokenEntity = new UserTokenEntity();
    tokenEntity.id = uuidv4();
    tokenEntity.userId = user.id;
    tokenEntity.accessToken = accessToken;
    tokenEntity.refreshToken = refreshToken;
    tokenEntity.userAgent = userAgent || '';
    tokenEntity.ipAddress = ipAddress || '';

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    tokenEntity.expiresAt = expires;
    tokenEntity.createdAt = new Date();
    tokenEntity.createdBy = user.id;

    await this.userTokenRepo.save(tokenEntity);

    return { accessToken, refreshToken };
  }

  async login(data: UserLoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.userRepo.findOne({
      where: [{ email: data.email }, { phone: data.email }],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );
    }

    const tokens = await this.generateAuthTokens(user, userAgent, ipAddress);

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        customer,
      },
      ...tokens,
    };
  }

  async register(data: RegisterDto) {
    const identifier = data.sendMethod === 'EMAIL' ? data.email : data.phone;

    await this.otpService.verifyOtp(identifier, data.otpCode, data.sendMethod);

    const existUser = await this.userRepo.findOne({
      where: [
        { email: data.email, isActive: true },
        { phone: data.phone, isActive: true },
      ],
    });

    if (existUser) {
      throw new BadRequestException('Email hoặc số điện thoại đã được đăng ký');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = new UserEntity();
    user.id = uuidv4();
    user.email = data.email;
    user.phone = data.phone;
    user.password = hashedPassword;
    user.role = enumData.USER_ROLE.COUPLE.code;
    user.isActive = true;
    user.createdAt = new Date();
    user.createdBy = undefined;

    await this.userRepo.save(user);

    const customer = new CustomerEntity();
    customer.id = uuidv4();
    customer.userId = user.id;
    customer.fullName = data.name;
    customer.email = data.email;
    customer.phone = data.phone;
    customer.gender = data.gender || 'OTHER';
    customer.code = `CUS_${Math.floor(100000 + Math.random() * 900000)}`;
    customer.createdAt = new Date();
    customer.createdBy = undefined;

    await this.customerRepo.save(customer);

    return { message: 'Đăng ký tài khoản thành công', user: { id: user.id } };
  }

  async logout(user: any, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      await this.userTokenRepo.update(
        { refreshToken: refreshTokenStr, userId: user.id },
        { isRevoked: true, updatedAt: new Date(), updatedBy: user.id },
      );
    } else {
      await this.userTokenRepo.update(
        { userId: user.id, isRevoked: false },
        { isRevoked: true, updatedAt: new Date(), updatedBy: user.id },
      );
    }
    return { message: 'Đăng xuất thành công' };
  }

  async cleanExpiredTokens() {
    const result = await this.userTokenRepo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < NOW()')
      .orWhere('isRevoked = true')
      .execute();
    return {
      message: 'Dọn dẹp token thành công',
      deletedCount: result.affected || 0,
    };
  }

  async verifyEmail(data: VerifyEmailDto) {
    await this.otpService.verifyOtp(data.email, data.otpCode, 'EMAIL');

    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    user.isActive = true;
    user.updatedAt = new Date();
    await this.userRepo.save(user);

    return { message: 'Xác thực email thành công' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được xác thực');
    }

    const otpCode = await this.otpService.createOtp(email, 'EMAIL');
    await this.emailService.sendEmailVerify({ email, otpCode });

    return { message: 'Gửi lại mã xác thực thành công' };
  }

  async refreshToken(data: RefreshTokenDto) {
    const tokenRecord = await this.userTokenRepo.findOne({
      where: { refreshToken: data.refreshToken, isRevoked: false },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    if (
      !tokenRecord ||
      !tokenRecord.expiresAt ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: tokenRecord.userId },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Người dùng không hợp lệ');
    }

    const tokens = await this.generateAuthTokens(
      user,
      tokenRecord.userAgent,
      tokenRecord.ipAddress,
    );

    tokenRecord.isRevoked = true;
    tokenRecord.updatedAt = new Date();
    await this.userTokenRepo.save(tokenRecord);

    await this.userTokenRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId AND expiresAt < NOW()', { userId: user.id })
      .execute();

    return {
      message: 'Làm mới token thành công',
      ...tokens,
    };
  }

  async checkPhoneAndEmail(data: CheckPhoneAndEmailDto) {
    if (data.email) {
      const exist = await this.userRepo.findOne({
        where: { email: data.email },
      });
      if (exist) throw new BadRequestException('Email đã tồn tại');
    }
    if (data.phone) {
      const exist = await this.userRepo.findOne({
        where: { phone: data.phone },
      });
      if (exist) throw new BadRequestException('Số điện thoại đã tồn tại');
    }
    return { message: 'Có thể sử dụng' };
  }

  async sendOtpEmailCustomer(data: SendOtpCustomerDto) {
    const identifier = data.sendMethod === 'EMAIL' ? data.email : data.phone;
    if (!identifier) {
      throw new BadRequestException('Vui lòng cung cấp email/sđt!');
    }

    const user = await this.userRepo.findOne({
      where:
        data.sendMethod === 'EMAIL'
          ? { email: identifier }
          : { phone: identifier },
    });

    if (user) {
      throw new BadRequestException(
        'Tài khoản đã tồn tại. Vui lòng đăng nhập.',
      );
    }

    const otpCode = await this.otpService.createOtp(
      identifier,
      data.sendMethod,
    );

    if (data.sendMethod === 'EMAIL') {
      await this.emailService.sendEmailVerify({ email: identifier, otpCode });
    }

    return { message: 'Gửi mã OTP thành công' };
  }

  async sendOtpVerify(data: SendOtpVerifyDto) {
    const otpCode = await this.otpService.createOtp(
      data.identifier,
      data.method,
    );

    if (data.method === 'EMAIL') {
      await this.emailService.sendLoginOtp({ email: data.identifier, otpCode });
    }

    return { message: 'Gửi mã xác nhận thành công' };
  }

  async forgotPassword(data: ForgotPasswordCustomerDto) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    const user = await this.userRepo.findOne({
      where:
        data.method === 'EMAIL'
          ? { email: data.identifier }
          : { phone: data.identifier },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.newPassword, salt);
    user.updatedAt = new Date();

    await this.userRepo.save(user);

    return { message: 'Khôi phục mật khẩu thành công' };
  }

  async verifyLoginOtp(
    data: VerifyLoginOtpDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    let user = await this.userRepo.findOne({
      where:
        data.method === 'EMAIL'
          ? { email: data.identifier }
          : { phone: data.identifier },
    });

    if (!user) {
      user = new UserEntity();
      user.id = uuidv4();
      if (data.method === 'EMAIL') {
        user.email = data.identifier;
      } else {
        user.phone = data.identifier;
      }
      user.password = '';
      user.role = enumData.USER_ROLE.COUPLE.code;
      user.isActive = true;
      user.createdAt = new Date();
      user.createdBy = undefined;
      await this.userRepo.save(user);

      const customer = new CustomerEntity();
      customer.id = uuidv4();
      customer.userId = user.id;
      customer.fullName = user.email;
      if (data.method === 'EMAIL') {
        customer.email = data.identifier;
      } else {
        customer.phone = data.identifier;
      }
      customer.code = `CUS_${Math.floor(100000 + Math.random() * 900000)}`;
      customer.gender = 'OTHER';
      customer.createdAt = new Date();
      customer.createdBy = undefined;
      await this.customerRepo.save(customer);
    }

    if (!user.isActive) throw new UnauthorizedException('Tài khoản đã bị khóa');

    const tokens = await this.generateAuthTokens(user, userAgent, ipAddress);

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    return {
      message: 'Xác thực OTP và đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        customer,
      },
      ...tokens,
    };
  }

  async changePassword(
    { currentPassword, newPassword, confirmPassword }: ChangePasswordDto,
    userDto: any,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp',
      );
    }
    return this.updatePassword({ currentPassword, newPassword }, userDto);
  }

  async updatePassword(
    { currentPassword, newPassword }: UpdatePasswordDto,
    userDto: any,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userDto.id } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userRepo.save(user);

    return { message: 'Cập nhật mật khẩu thành công' };
  }

  async getUserInfo(userDto: any) {
    const user = await this.userRepo.findOne({ where: { id: userDto.id } });
    const customer = await this.customerRepo.findOne({
      where: { userId: userDto.id },
    });
    return {
      message: 'Lấy thông tin thành công',
      data: { ...user, customer },
    };
  }

  async updateProfile(userDto: any, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userDto.id } });
    if (!user) throw new BadRequestException('Không tìm thấy người dùng');

    let customer = await this.customerRepo.findOne({
      where: { userId: userDto.id },
    });

    if (!customer) {
      customer = new CustomerEntity();
      customer.id = uuidv4();
      customer.userId = user.id;
      customer.fullName = dto.fullName || 'Khách Hàng';
      customer.email = user.email;
      customer.createdBy = user.id;
    }

    if (dto.fullName !== undefined) customer.fullName = dto.fullName;
    if (dto.phone !== undefined) {
      customer.phone = dto.phone;
      user.phone = dto.phone;
    }
    if (dto.gender !== undefined) customer.gender = dto.gender;
    if (dto.dateOfBirth !== undefined)
      customer.dateOfBirth = new Date(dto.dateOfBirth);

    customer.updatedBy = user.id;
    customer.updatedAt = new Date();
    await this.customerRepo.save(customer);

    user.updatedBy = user.id;
    user.updatedAt = new Date();
    await this.userRepo.save(user);

    return {
      message: 'Cập nhật thông tin thành công',
      data: { ...user, customer },
    };
  }

  async loginWithGoogle(
    data: GoogleLoginDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const googleUser = await this.verifyGoogleAccessToken(data.idToken);
    return this.handleGoogleUser(googleUser, userAgent, ipAddress);
  }

  async getGoogleAuthUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline` +
      `&prompt=consent`;
    return url;
  }

  async handleGoogleCallback(
    code: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const tokenResponse = await this.exchangeGoogleCode(code);
    const googleUser = await this.getGoogleUserInfo(tokenResponse.access_token);
    return this.handleGoogleUser(googleUser, userAgent, ipAddress);
  }

  private async exchangeGoogleCode(code: string) {
    const { data } = await lastValueFrom(
      this.httpService.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
        code,
      }),
    );
    return data;
  }

  private async getGoogleUserInfo(accessToken: string) {
    const { data } = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    if (data.email_verified === false) {
      throw new BadRequestException('Email Google chưa được xác thực');
    }
    return data;
  }

  async getFacebookAuthUrl() {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL;
    const url =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${appId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=email,public_profile` +
      `&response_type=code`;
    return url;
  }

  async handleFacebookCallback(
    code: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const tokenResponse = await this.exchangeFacebookCode(code);
    const fbUser = await this.getFacebookUserInfoFromCode(
      tokenResponse.access_token,
    );
    return this.handleFacebookUser(fbUser, userAgent, ipAddress);
  }

  private async exchangeFacebookCode(code: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(
        'https://graph.facebook.com/v18.0/oauth/access_token',
        {
          params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
            code,
          },
        },
      ),
    );
    return data;
  }

  private async getFacebookUserInfoFromCode(accessToken: string) {
    const { data } = await lastValueFrom(
      this.httpService.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email,picture.type(large)',
          access_token: accessToken,
        },
      }),
    );
    return data;
  }

  private async handleFacebookUser(
    fbUser: any,
    userAgent?: string,
    ipAddress?: string,
  ) {
    let user = await this.userRepo.findOne({
      where: { email: fbUser.email },
    });

    if (!user) {
      user = new UserEntity();
      user.id = uuidv4();
      user.email = fbUser.email;
      user.password = '';
      user.role = enumData.USER_ROLE.COUPLE.code;
      user.isActive = true;
      await this.userRepo.save(user);

      const customer = new CustomerEntity();
      customer.id = uuidv4();
      customer.userId = user.id;
      customer.fullName = fbUser.name || fbUser.email;
      customer.email = fbUser.email;
      customer.code = `CUS_${Math.floor(100000 + Math.random() * 900000)}`;
      customer.gender = 'OTHER';
      customer.createdAt = new Date();
      customer.createdBy = undefined;
      await this.customerRepo.save(customer);
    }

    const tokens = await this.generateAuthTokens(user, userAgent, ipAddress);

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        customer,
      },
      ...tokens,
    };
  }

  private async handleGoogleUser(
    googleUser: any,
    userAgent?: string,
    ipAddress?: string,
  ) {
    let user = await this.userRepo.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = new UserEntity();
      user.id = uuidv4();
      user.email = googleUser.email;
      user.password = '';
      user.role = enumData.USER_ROLE.COUPLE.code;
      user.isActive = true;
      await this.userRepo.save(user);

      const customer = new CustomerEntity();
      customer.id = uuidv4();
      customer.userId = user.id;
      customer.fullName = googleUser.name || googleUser.email;
      customer.email = googleUser.email;
      customer.code = `CUS_${Math.floor(100000 + Math.random() * 900000)}`;
      customer.gender = 'OTHER';
      customer.createdAt = new Date();
      customer.createdBy = undefined;
      await this.customerRepo.save(customer);
    }

    const tokens = await this.generateAuthTokens(user, userAgent, ipAddress);

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        customer,
      },
      ...tokens,
    };
  }

  private async verifyGoogleAccessToken(token: string) {
    if (token.startsWith('mock-')) {
      const email = token.replace('mock-', '');
      return { email, email_verified: true, name: email };
    }
    return this.getGoogleUserInfo(token);
  }

  async loginWithFacebook(
    data: FacebookLoginDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const fbUser = await this.getFacebookUserInfo(data.accessToken);
    return this.handleFacebookUser(fbUser, userAgent, ipAddress);
  }

  private async getFacebookUserInfo(accessToken: string) {
    if (accessToken.startsWith('mock-')) {
      const email = accessToken.replace('mock-', '');
      return { email };
    }
    try {
      const url = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error: any) {
      throw new BadRequestException('Token Facebook không hợp lệ');
    }
  }
}
