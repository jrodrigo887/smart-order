import { IsOptional, IsUUID } from 'class-validator';

export class CancelOrderItemDto {
  @IsOptional()
  @IsUUID()
  collaboratorId?: string;
}
