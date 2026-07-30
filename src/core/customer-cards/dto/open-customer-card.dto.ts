import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class OpenCustomerCardDto {
  @IsInt()
  @IsPositive()
  cardNumber: number;

  @IsUUID()
  waiterId: string;

  @IsUUID()
  restaurantId: string;
}
