import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateEnvFileDto } from './dto';
import { EnvManagerService } from './env-manager.service';

@ApiBearerAuth()
@ApiTags('Admin - Env Manager')
@Controller('env-manager')
export class EnvManagerController {
  constructor(private readonly service: EnvManagerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('files')
  async listFiles() {
    return await this.service.listFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Get('files/:project/:environment')
  async readFile(
    @Param('project') project: string,
    @Param('environment') environment: string,
  ) {
    return await this.service.readFile(project, environment);
  }

  @UseGuards(JwtAuthGuard)
  @Put('files/:project/:environment')
  async updateFile(
    @Param('project') project: string,
    @Param('environment') environment: string,
    @Body() data: UpdateEnvFileDto,
    @CurrentUser() user: UserDto,
  ) {
    // TODO: Sau này thêm phân quyền SUPER_ADMIN tại đây
    // if (!user.isSuperAdmin) throw new ForbiddenException(...);

    // Ghi log ngưởi sửa (tạm log console, sau này đưa vào action log)
    console.log(`[EnvManager] User ${user.id} (${user.email}) updated ${project}/${environment}`);

    return await this.service.updateFile(project, environment, data.content);
  }

  @UseGuards(JwtAuthGuard)
  @Put('files/:project/:environment/reload')
  async reloadContainer(
    @Param('project') project: string,
    @Param('environment') environment: string,
  ) {
    // TODO: Tích hợp Docker / Docker Compose reload
    throw new NotImplementedException(
      `Auto reload not implemented yet. Please rebuild ${project}:${environment} manually.`,
    );
  }
}
