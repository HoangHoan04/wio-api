import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FindOptionsWhere } from 'typeorm';
import { AiSuggestionRepository } from '@/repositories';
import { AiSuggestionEntity } from '@/entities';
import { UserDto, IdDto, PaginationDto } from '@/dto';
import { CreateAiSuggestionDto, UpdateAiSuggestionDto, FilterAiSuggestionDto } from './dto';

@Injectable()
export class AiSuggestionService {
  constructor(private readonly repo: AiSuggestionRepository) {}

  async pagination(data: PaginationDto<FilterAiSuggestionDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<AiSuggestionEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.targetGroup !== undefined) whereCon.targetGroup = where.targetGroup;
    if (where.tone !== undefined) whereCon.tone = where.tone;
    if (where.language !== undefined) whereCon.language = where.language;
    if (where.customPrompt !== undefined) whereCon.customPrompt = where.customPrompt;
    if (where.generatedText !== undefined) whereCon.generatedText = where.generatedText;
    if (where.modelUsed !== undefined) whereCon.modelUsed = where.modelUsed;
    if (where.tokensUsed !== undefined) whereCon.tokensUsed = where.tokensUsed;
    if (where.isUsed !== undefined) whereCon.isUsed = where.isUsed;
    if (where.usedAt !== undefined) whereCon.usedAt = where.usedAt;


    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' } as any,
    });

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({ where: { id: data.id, isDeleted: false } as any });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateAiSuggestionDto) {
    const entity = new AiSuggestionEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.targetGroup !== undefined) entity.targetGroup = dto.targetGroup;
    if (dto.tone !== undefined) entity.tone = dto.tone;
    if (dto.language !== undefined) entity.language = dto.language;
    if (dto.customPrompt !== undefined) entity.customPrompt = dto.customPrompt;
    if (dto.generatedText !== undefined) entity.generatedText = dto.generatedText;
    if (dto.modelUsed !== undefined) entity.modelUsed = dto.modelUsed;
    if (dto.tokensUsed !== undefined) entity.tokensUsed = dto.tokensUsed;
    if (dto.isUsed !== undefined) entity.isUsed = dto.isUsed;
    if (dto.usedAt !== undefined) entity.usedAt = dto.usedAt;


    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateAiSuggestionDto, user: UserDto) {
    const entity = await this.repo.findOne({ where: { id: dto.id, isDeleted: false } as any });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.targetGroup !== undefined) entity.targetGroup = dto.targetGroup;
    if (dto.tone !== undefined) entity.tone = dto.tone;
    if (dto.language !== undefined) entity.language = dto.language;
    if (dto.customPrompt !== undefined) entity.customPrompt = dto.customPrompt;
    if (dto.generatedText !== undefined) entity.generatedText = dto.generatedText;
    if (dto.modelUsed !== undefined) entity.modelUsed = dto.modelUsed;
    if (dto.tokensUsed !== undefined) entity.tokensUsed = dto.tokensUsed;
    if (dto.isUsed !== undefined) entity.isUsed = dto.isUsed;
    if (dto.usedAt !== undefined) entity.usedAt = dto.usedAt;


    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({ where: { id: data.id, isDeleted: false } as any });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }
}
