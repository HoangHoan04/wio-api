import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { EnvFileListItemDto, EnvFileResponseDto } from './dto';

export interface EnvFileConfig {
  project: string;
  environment: string;
  path: string;
}

@Injectable()
export class EnvManagerService {
  private readonly basePath: string;
  private readonly files: EnvFileConfig[];

  constructor() {
    // Đường dẫn gốc đến thư mục chứa các repo wio trên server
    this.basePath = process.env.ENV_MANAGER_BASE_PATH || '/opt/wio';

    this.files = [
      {
        project: 'wio-admin',
        environment: 'production',
        path: 'wio-admin/.env.production',
      },
      {
        project: 'wio-admin',
        environment: 'development',
        path: 'wio-admin/.env.development',
      },
      {
        project: 'wio-customer',
        environment: 'production',
        path: 'wio-customer/.env.production',
      },
      {
        project: 'wio-customer',
        environment: 'development',
        path: 'wio-customer/.env.development',
      },
      {
        project: 'wio-api',
        environment: 'dev-local',
        path: 'wio-api/.env.dev.local',
      },
      {
        project: 'wio-api',
        environment: 'prod-local',
        path: 'wio-api/.env.prod.local',
      },
    ];
  }

  async listFiles(): Promise<EnvFileListItemDto[]> {
    const result: EnvFileListItemDto[] = [];

    for (const file of this.files) {
      const fullPath = this.getFullPath(file.path);
      try {
        const stats = await fs.stat(fullPath);
        result.push({
          project: file.project,
          environment: file.environment,
          path: fullPath,
          updatedAt: stats.mtime,
        });
      } catch {
        // File chưa tồn tại, vẫn hiển thị để có thể tạo mới
        result.push({
          project: file.project,
          environment: file.environment,
          path: fullPath,
          updatedAt: new Date(0),
        });
      }
    }

    return result;
  }

  async readFile(
    project: string,
    environment: string,
  ): Promise<EnvFileResponseDto> {
    const config = this.findConfig(project, environment);
    const fullPath = this.getFullPath(config.path);

    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const stats = await fs.stat(fullPath);
      return {
        project,
        environment,
        path: fullPath,
        content,
        updatedAt: stats.mtime,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException(`Env file not found: ${fullPath}`);
      }
      throw new BadRequestException(
        `Cannot read env file: ${(error as Error).message}`,
      );
    }
  }

  async updateFile(
    project: string,
    environment: string,
    content: string,
  ): Promise<EnvFileResponseDto> {
    const config = this.findConfig(project, environment);
    const fullPath = this.getFullPath(config.path);

    // Validate cơ bản: không cho phép xóa hoàn toàn file, chỉ chứa key=value
    this.validateContent(content);

    try {
      // Backup file cũ trước khi ghi đè
      try {
        await fs.access(fullPath);
        const backupPath = `${fullPath}.backup-${Date.now()}`;
        await fs.copyFile(fullPath, backupPath);
      } catch {
        // File chưa tồn tại, không cần backup
      }

      await fs.writeFile(fullPath, content, 'utf-8');
      const stats = await fs.stat(fullPath);
      return {
        project,
        environment,
        path: fullPath,
        content,
        updatedAt: stats.mtime,
      };
    } catch (error) {
      throw new BadRequestException(
        `Cannot write env file: ${(error as Error).message}`,
      );
    }
  }

  private findConfig(project: string, environment: string): EnvFileConfig {
    const config = this.files.find(
      (f) => f.project === project && f.environment === environment,
    );
    if (!config) {
      throw new NotFoundException(
        `Env file config not found: ${project}/${environment}`,
      );
    }
    return config;
  }

  private getFullPath(relativePath: string): string {
    return join(this.basePath, relativePath);
  }

  private validateContent(content: string): void {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Cho phép dạng KEY=VALUE hoặc KEY="VALUE"
      if (!/^[A-Za-z_][A-Za-z0-9_]*=.*$/.test(trimmed)) {
        throw new BadRequestException(`Invalid env line: ${trimmed}`);
      }
    }
  }
}
