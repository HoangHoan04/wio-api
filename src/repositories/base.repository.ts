import { ActionLogEntity } from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(ActionLogEntity)
export class ActionLogRepository extends Repository<ActionLogEntity> {}
