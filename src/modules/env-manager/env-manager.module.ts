import { Module } from '@nestjs/common';
import { EnvManagerController } from './env-manager.controller';
import { EnvManagerService } from './env-manager.service';

@Module({
  controllers: [EnvManagerController],
  providers: [EnvManagerService],
})
export class EnvManagerModule {}
