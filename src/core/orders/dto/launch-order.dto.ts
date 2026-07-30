import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class LaunchOrderItemDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsPositive()
  quantity?: number;
}

export class LaunchOrderDto {
  @IsUUID()
  customerCardId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LaunchOrderItemDto)
  items: LaunchOrderItemDto[];
}
