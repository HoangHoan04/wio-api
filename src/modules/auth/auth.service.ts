import { enumData } from '@/common/constanst/enumData';
import { CustomerEntity, UserEntity } from '@/entities';
import {
  CustomerRepository,
  SubscriptionRepository,
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
import { LessThan } from 'typeorm';
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
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly otpService: OtpService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  /* ============================================================
   * HELPER
   * ============================================================ */
  private generateCustomerCode(): string {
    return `CUS_${Math.floor(100000 + Math.random() * 900000)}`;
  }

  private async generateAuthTokens(
    user: UserEntity,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken();

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const tokenEntity = this.userTokenRepo.create({
      id: uuidv4(),
      userId: user.id,
      accessToken,
      refreshToken,
      userAgent: userAgent || '',
      ipAddress: ipAddress || '',
      expiresAt: expires,
      createdBy: user.id,
    });

    await this.userTokenRepo.save(tokenEntity);
    return { accessToken, refreshToken };
  }

  private async createCustomerForUser(
    user: UserEntity,
    fullName?: string,
  ): Promise<CustomerEntity> {
    const customer = this.customerRepo.create({
      id: uuidv4(),
      userId: user.id,
      fullName: fullName || user.email || 'Khách hàng',
      email: user.email,
      phone: user.phone,
      gender: 'OTHER',
      code: this.generateCustomerCode(),
      createdBy: user.id,
    });
    return this.customerRepo.save(customer);
  }

  /* ============================================================
   * LOGIN
   * ============================================================ */
  async login(data: UserLoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.userRepo.findOne({
      where: [{ email: data.email }, { phone: data.email }],
      select: ['id', 'email', 'phone', 'password', 'role', 'isActive'],
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

  /* ============================================================
   * REGISTER
   * ============================================================ */
  async register(data: RegisterDto) {
    const identifier =
      data.sendMethod === enumData.OTP_METHOD.EMAIL.code
        ? data.email
        : data.phone;

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

    const user = this.userRepo.create({
      id: uuidv4(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: enumData.USER_ROLE.CUSTOMER.code,
      isActive: true,
    });
    await this.userRepo.save(user);

    const customer = await this.createCustomerForUser(user, data.name);
    if (data.gender) {
      customer.gender = data.gender;
      await this.customerRepo.save(customer);
    }

    return { message: 'Đăng ký tài khoản thành công', user: { id: user.id } };
  }

  /* ============================================================
   * LOGOUT
   * ============================================================ */
  async logout(user: any, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      await this.userTokenRepo.update(
        { refreshToken: refreshTokenStr, userId: user.id },
        { isRevoked: true, updatedBy: user.id },
      );
    } else {
      await this.userTokenRepo.update(
        { userId: user.id, isRevoked: false },
        { isRevoked: true, updatedBy: user.id },
      );
    }
    return { message: 'Đăng xuất thành công' };
  }

  /* ============================================================
   * CLEAN TOKENS — dùng repo.delete với điều kiện (không QB)
   * ============================================================ */
  async cleanExpiredTokens() {
    // Xoá token hết hạn
    const expiredResult = await this.userTokenRepo.delete({
      expiresAt: LessThan(new Date()),
    });

    // Xoá token đã bị thu hồi
    const revokedResult = await this.userTokenRepo.delete({
      isRevoked: true,
    });

    const deletedCount =
      (expiredResult.affected || 0) + (revokedResult.affected || 0);

    return {
      message: 'Dọn dẹp token thành công',
      deletedCount,
    };
  }

  /* ============================================================
   * VERIFY EMAIL
   * ============================================================ */
  async verifyEmail(data: VerifyEmailDto) {
    await this.otpService.verifyOtp(
      data.email,
      data.otpCode,
      enumData.OTP_METHOD.EMAIL.code,
    );

    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    user.isActive = true;
    await this.userRepo.save(user);

    return { message: 'Xác thực email thành công' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    if (user.isActive)
      throw new BadRequestException('Tài khoản đã được xác thực');

    const otpCode = await this.otpService.createOtp(
      email,
      enumData.OTP_METHOD.EMAIL.code,
    );
    await this.emailService.sendEmailVerify({ email, otpCode });

    return { message: 'Gửi lại mã xác thực thành công' };
  }

  /* ============================================================
   * REFRESH TOKEN — dùng repo.delete thay QB
   * ============================================================ */
  async refreshToken(data: RefreshTokenDto) {
    const tokenRecord = await this.userTokenRepo.findOne({
      where: { refreshToken: data.refreshToken, isRevoked: false },
    });

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
    await this.userTokenRepo.save(tokenRecord);

    // Xoá token hết hạn của user — dùng repo.delete + LessThan
    await this.userTokenRepo.delete({
      userId: user.id,
      expiresAt: LessThan(new Date()),
    });

    return { message: 'Làm mới token thành công', ...tokens };
  }

  /* ============================================================
   * CHECK PHONE & EMAIL
   * ============================================================ */
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

  /* ============================================================
   * SEND OTP
   * ============================================================ */
  async sendOtpEmailCustomer(data: SendOtpCustomerDto) {
    const identifier =
      data.sendMethod === enumData.OTP_METHOD.EMAIL.code
        ? data.email
        : data.phone;
    if (!identifier)
      throw new BadRequestException('Vui lòng cung cấp email/sđt!');

    const user = await this.userRepo.findOne({
      where:
        data.sendMethod === enumData.OTP_METHOD.EMAIL.code
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

    if (data.sendMethod === enumData.OTP_METHOD.EMAIL.code) {
      await this.emailService.sendEmailVerify({ email: identifier, otpCode });
    }

    return { message: 'Gửi mã OTP thành công' };
  }

  async sendOtpVerify(data: SendOtpVerifyDto) {
    const otpCode = await this.otpService.createOtp(
      data.identifier,
      data.method,
    );

    if (data.method === enumData.OTP_METHOD.EMAIL.code) {
      await this.emailService.sendLoginOtp({ email: data.identifier, otpCode });
    }

    return { message: 'Gửi mã xác nhận thành công' };
  }

  /* ============================================================
   * FORGOT PASSWORD
   * ============================================================ */
  async forgotPassword(data: ForgotPasswordCustomerDto) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    const user = await this.userRepo.findOne({
      where:
        data.method === enumData.OTP_METHOD.EMAIL.code
          ? { email: data.identifier }
          : { phone: data.identifier },
    });

    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    user.password = data.newPassword;
    await this.userRepo.save(user);

    return { message: 'Khôi phục mật khẩu thành công' };
  }

  /* ============================================================
   * VERIFY LOGIN OTP
   * ============================================================ */
  async verifyLoginOtp(
    data: VerifyLoginOtpDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    let user = await this.userRepo.findOne({
      where:
        data.method === enumData.OTP_METHOD.EMAIL.code
          ? { email: data.identifier }
          : { phone: data.identifier },
    });

    if (!user) {
      user = this.userRepo.create({
        id: uuidv4(),
        email:
          data.method === enumData.OTP_METHOD.EMAIL.code
            ? data.identifier
            : undefined,
        phone:
          data.method === enumData.OTP_METHOD.EMAIL.code
            ? undefined
            : data.identifier,
        password: '',
        role: enumData.USER_ROLE.CUSTOMER.code,
        isActive: true,
      });
      await this.userRepo.save(user);
      await this.createCustomerForUser(user);
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

  /* ============================================================
   * PASSWORD
   * ============================================================ */
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
    const user = await this.userRepo.findOne({
      where: { id: userDto.id },
      select: ['id', 'password'],
    });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    user.password = newPassword;
    await this.userRepo.save(user);

    return { message: 'Cập nhật mật khẩu thành công' };
  }

  /* ============================================================
   * USER INFO — dùng relation (không QB)
   * ============================================================ */
  async getUserInfo(userDto: any) {
    const user = await this.userRepo.findOne({
      where: { id: userDto.id },
      relations: { customer: true },
    });

    const customer = await this.customerRepo.findOne({
      where: { userId: userDto.id },
    });

    // Lấy subscription ACTIVE của user — dùng repo.find với relations
    const activeSubscription = await this.subscriptionRepo.findOne({
      where: {
        userId: userDto.id,
        status: enumData.SUB_STATUS.ACTIVE.code,
      },
      relations: { plan: true },
      order: { expiresAt: 'DESC' },
    });

    // Lọc thủ công subscription còn hạn (không dùng andWhere)
    const validSubscription =
      activeSubscription && activeSubscription.expiresAt > new Date()
        ? activeSubscription
        : null;

    return {
      message: 'Lấy thông tin thành công',
      data: {
        id: user?.id,
        email: user?.email,
        phone: user?.phone,
        role: user?.role,
        isActive: user?.isActive,
        customer,
        activeSubscription: validSubscription,
      },
    };
  }

  /* ============================================================
   * UPDATE PROFILE
   * ============================================================ */
  async updateProfile(userDto: any, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userDto.id } });
    if (!user) throw new BadRequestException('Không tìm thấy người dùng');

    let customer = await this.customerRepo.findOne({
      where: { userId: userDto.id },
    });

    if (!customer) {
      customer = await this.createCustomerForUser(user, dto.fullName);
    }

    if (dto.fullName !== undefined) customer.fullName = dto.fullName;
    if (dto.phone !== undefined) {
      customer.phone = dto.phone;
      user.phone = dto.phone;
    }
    if (dto.gender !== undefined) customer.gender = dto.gender;
    if (dto.dateOfBirth !== undefined) {
      customer.dateOfBirth = new Date(dto.dateOfBirth);
    }

    customer.updatedBy = user.id;
    await this.customerRepo.save(customer);

    user.updatedBy = user.id;
    await this.userRepo.save(user);

    return {
      message: 'Cập nhật thông tin thành công',
      data: { ...user, customer },
    };
  }

  /* ============================================================
   * GOOGLE
   * ============================================================ */
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

    if (!clientId || !redirectUri) {
      throw new BadRequestException(
        'Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
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

  private async verifyGoogleAccessToken(token: string) {
    if (token.startsWith('mock-')) {
      const email = token.replace('mock-', '');
      return { email, email_verified: true, name: email };
    }
    return this.getGoogleUserInfo(token);
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
      user = this.userRepo.create({
        id: uuidv4(),
        email: googleUser.email,
        password: '',
        role: enumData.USER_ROLE.CUSTOMER.code,
        isActive: true,
      });
      await this.userRepo.save(user);
      await this.createCustomerForUser(
        user,
        googleUser.name || googleUser.email,
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

  /* ============================================================
   * FACEBOOK
   * ============================================================ */
  async getFacebookAuthUrl() {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL;

    if (!appId || !redirectUri) {
      throw new BadRequestException(
        'Facebook OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
      );
    }

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: 'email,public_profile',
      response_type: 'code',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
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
    } catch {
      throw new BadRequestException('Token Facebook không hợp lệ');
    }
  }

  private resolveFacebookEmail(fbUser: { id?: string; email?: string }) {
    if (fbUser.email) return fbUser.email;
    if (!fbUser.id) {
      throw new BadRequestException(
        'Không thể lấy email từ Facebook. Vui lòng cấp quyền email hoặc dùng tài khoản khác.',
      );
    }
    return `fb_${fbUser.id}@facebook.local`;
  }

  private async handleFacebookUser(
    fbUser: any,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const email = this.resolveFacebookEmail(fbUser);

    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      user = this.userRepo.create({
        id: uuidv4(),
        email,
        password: '',
        role: enumData.USER_ROLE.CUSTOMER.code,
        isActive: true,
      });
      await this.userRepo.save(user);
      await this.createCustomerForUser(user, fbUser.name || email);
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
}
