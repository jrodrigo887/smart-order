import { IsOptional, IsString, IsUUID } from 'class-validator';

export class RegisterWaiterDto {
  @IsString()
  name: string;

  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
