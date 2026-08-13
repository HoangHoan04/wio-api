import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { CustomerEntity } from '@/entities';
import { transformKeys } from '@/helpers';
import { CustomerRepository, UserRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
@Injectable()
export class CustomerService {
  constructor(
    private readonly repo: CustomerRepository,
    private readonly actionLogService: ActionLogService,
    private readonly userRepo: UserRepository,
  ) {}

  async findById(data: IdDto) {
    const customer = await this.repo.findOne({
      where: { id: data.id },
    });

    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    const customerUser = await this.userRepo.findOne({
      where: { id: customer.userId },
    });

    const result = {
      ...transformKeys(customer),
      user: customerUser ? transformKeys(customerUser) : null,
    };

    return {
      message: 'Tìm kiếm khách hàng thành công',
      data: result,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        fullName: true,
      },
    });

    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<CustomerEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.fullName)
      whereCon.fullName = ILike(`%${data.where.fullName}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if (data.where.email) whereCon.email = ILike(`%${data.where.email}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [customers, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
      },
    });

    return { data: customers, total };
  }

  async deactivate(user: UserDto, data: IdDto) {
    const customer = await this.repo.findOne({ where: { id: data.id } });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    await this.repo.update(data.id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const customerUser = await this.userRepo.findOne({
      where: { id: customer.userId },
    });
    if (customerUser) {
      await this.userRepo.update(customerUser.id, {
        isActive: false,
        isDeleted: true,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: data.id,
      entityName: 'CustomerEntity',
      actionType: enumData.ACTION_TYPE.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.email,
      createdNote: `Ngưng hoạt động khách hàng: ${customer.code}`,
      oldValue: JSON.stringify({ isDeleted: false }),
      newValue: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Ngưng hoạt động khách hàng thành công' };
  }

  async activate(user: UserDto, data: IdDto) {
    const customer = await this.repo.findOne({ where: { id: data.id } });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    await this.repo.update(data.id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const customerUser = await this.userRepo.findOne({
      where: { id: customer.userId },
    });
    if (customerUser) {
      await this.userRepo.update(customerUser.id, {
        isActive: true,
        isDeleted: false,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: data.id,
      entityName: 'CustomerEntity',
      actionType: enumData.ACTION_TYPE.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.email,
      createdNote: `Kích hoạt khách hàng: ${customer.code}`,
      oldValue: JSON.stringify({ isDeleted: true }),
      newValue: JSON.stringify({ isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Kích hoạt khách hàng thành công' };
  }

  async changePassword(
    user: UserDto,
    data: { customerId: string; newPassword: string },
  ) {
    const customer = await this.repo.findOne({
      where: { id: data.customerId },
    });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    const customerUser = await this.userRepo.findOne({
      where: { id: customer.userId },
    });
    if (!customerUser)
      throw new NotFoundException('Khách hàng chưa có tài khoản hệ thống');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepo.update(customerUser.id, {
      password: hashedPassword,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: data.customerId,
      entityName: 'CustomerEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.email,
      createdNote: `Đổi mật khẩu cho khách hàng: ${customer.code}`,
      oldValue: '',
      newValue: 'Password Changed',
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
