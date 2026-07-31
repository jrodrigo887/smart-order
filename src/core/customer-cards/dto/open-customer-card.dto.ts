import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class OpenCustomerCardDto {
  @IsInt()
  @IsPositive()
  cardNumber: number;

  @IsUUID()
  collaboratorId: string;

  @IsUUID()
  establishmentId: string;
}
