import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { CustomerEntity } from '@/entities';
import { CustomerRepository, UserRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import { ChangeCustomerPasswordDto, FilterCustomerDto } from './dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly repo: CustomerRepository,
    private readonly userRepo: UserRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER: Ghi ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entityId: string,
    note: string,
    oldValue?: any,
    newValue?: any,
  ) {
    const dto: ActionLogCreateDto = {
      entityId,
      entityName: 'CustomerEntity',
      actionType,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: note,
      oldValue,
      newValue,
    };
    await this.actionLogService.create(dto);
  }

  /* ============================================================
   * FIND BY ID — dùng relation
   * ============================================================ */
  async findById(data: IdDto) {
    const customer = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { user: true },
    });

    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    return {
      message: 'Tìm kiếm khách hàng thành công',
      data: customer,
    };
  }

  /* ============================================================
   * SELECT BOX
   * ============================================================ */
  async selectBox() {
    return this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, fullName: true },
      order: { fullName: 'ASC' },
    });
  }

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterCustomerDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<CustomerEntity> = {};

    if (where.code) whereCon.code = ILike(`%${where.code}%`);
    if (where.fullName) whereCon.fullName = ILike(`%${where.fullName}%`);
    if (where.phone) whereCon.phone = ILike(`%${where.phone}%`);
    if (where.email) whereCon.email = ILike(`%${where.email}%`);
    if ([true, false].includes(where.isDeleted as any)) {
      whereCon.isDeleted = where.isDeleted;
    }

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });

    return { data: list, total };
  }

  /* ============================================================
   * DEACTIVATE (xoá mềm customer + vô hiệu user)
   * ============================================================ */
  async deactivate(user: UserDto, data: IdDto) {
    const customer = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    await this.repo.update(data.id, {
      isDeleted: true,
      updatedBy: user.id,
    });

    await this.userRepo.update(
      { id: customer.userId },
      {
        isActive: false,
        isDeleted: true,
        updatedBy: user.id,
      },
    );

    await this.logAction(
      user,
      enumData.ACTION_TYPE.DEACTIVATE.code,
      data.id,
      `Ngưng hoạt động khách hàng: ${customer.code}`,
      { isDeleted: false },
      { isDeleted: true },
    );

    return { message: 'Ngưng hoạt động khách hàng thành công' };
  }

  /* ============================================================
   * ACTIVATE
   * ============================================================ */
  async activate(user: UserDto, data: IdDto) {
    const customer = await this.repo.findOne({ where: { id: data.id } });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    await this.repo.update(data.id, {
      isDeleted: false,
      updatedBy: user.id,
    });

    await this.userRepo.update(
      { id: customer.userId },
      {
        isActive: true,
        isDeleted: false,
        updatedBy: user.id,
      },
    );

    await this.logAction(
      user,
      enumData.ACTION_TYPE.ACTIVATE.code,
      data.id,
      `Kích hoạt khách hàng: ${customer.code}`,
      { isDeleted: true },
      { isDeleted: false },
    );

    return { message: 'Kích hoạt khách hàng thành công' };
  }

  /* ============================================================
   * CHANGE PASSWORD
   * ============================================================ */
  async changePassword(user: UserDto, dto: ChangeCustomerPasswordDto) {
    const customer = await this.repo.findOne({
      where: { id: dto.customerId },
    });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    const customerUser = await this.userRepo.findOne({
      where: { id: customer.userId },
    });
    if (!customerUser) {
      throw new NotFoundException('Khách hàng chưa có tài khoản hệ thống');
    }

    // ✅ Không hash thủ công — UserEntity.hashPassword() tự hash khi save/update
    await this.userRepo.update(
      { id: customerUser.id },
      {
        password: dto.newPassword,
        updatedBy: user.id,
      },
    );

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      dto.customerId,
      `Đổi mật khẩu cho khách hàng: ${customer.code}`,
    );

    return { message: 'Đổi mật khẩu thành công' };
  }
}
