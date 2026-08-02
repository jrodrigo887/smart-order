import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class AddMenuItemDto {
  @IsUUID()
  menuId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
