import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import {
  CancellationRole,
  CancellationRoleType,
} from '../domain/entities/order-item.entity';

class CancellationActorDto {
  @IsIn(Object.values(CancellationRole))
  role: CancellationRoleType;
}

export class CancelOrderItemDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CancellationActorDto)
  actor?: CancellationActorDto;
}
