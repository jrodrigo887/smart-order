import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMenuItemDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
