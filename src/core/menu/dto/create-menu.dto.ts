import { IsString, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @IsUUID()
  establishmentId: string;

  @IsString()
  name: string;
}
