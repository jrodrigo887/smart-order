import { IsString } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  cnpj: string;

  @IsString()
  corporateName: string;

  @IsString()
  tradeName: string;

  @IsString()
  address: string;
}
