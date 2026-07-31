import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  EstablishmentUnitType,
  EstablishmentUnitTypeType,
} from '../domain/enums/establishment-unit-type.enum';

export class RegisterEstablishmentDto {
  @IsUUID()
  companyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsIn(Object.values(EstablishmentUnitType))
  unitType: EstablishmentUnitTypeType;

  @IsString()
  address: string;
}
