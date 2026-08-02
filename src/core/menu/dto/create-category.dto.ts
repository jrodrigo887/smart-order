import { IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  establishmentId: string;

  @IsString()
  name: string;
}
