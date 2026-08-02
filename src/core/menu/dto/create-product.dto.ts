import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  establishmentId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
