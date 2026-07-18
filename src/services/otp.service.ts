import { VerifyOtpEntity } from '@/entities';
import { VerifyOtpRepository } from '@/repositories';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OtpService {
  constructor(private readonly verifyOtpRepo: VerifyOtpRepository) {}

  async createOtp(identifier: string, method: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const otpEntity = new VerifyOtpEntity();
    otpEntity.id = uuidv4();
    otpEntity.identifier = identifier;
    otpEntity.otpCode = otpCode;
    otpEntity.method = method;
    otpEntity.expiresAt = expiresAt;
    otpEntity.isVerified = false;
    otpEntity.createdAt = new Date();
    otpEntity.createdBy = undefined;

    await this.verifyOtpRepo.save(otpEntity);

    return otpCode;
  }

  async verifyOtp(
    identifier: string,
    otpCode: string,
    method: string,
  ): Promise<void> {
    const otpEntity = await this.verifyOtpRepo.findOne({
      where: {
        identifier,
        otpCode,
        method,
        isVerified: false,
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!otpEntity) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }

    if (otpEntity.expiresAt < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    otpEntity.isVerified = true;
    otpEntity.updatedAt = new Date();
    await this.verifyOtpRepo.save(otpEntity);
  }
}
