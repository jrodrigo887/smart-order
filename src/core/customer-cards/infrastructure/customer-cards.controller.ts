import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OpenCustomerCardDto } from '../dto/open-customer-card.dto';
import { CustomerCardsService } from './customer-cards.service';

@Controller()
export class CustomerCardsController {
  constructor(private readonly customerCardsService: CustomerCardsService) {}

  @Post('customer-cards')
  open(@Body() dto: OpenCustomerCardDto) {
    return this.customerCardsService.open(dto);
  }

  @Get('customer-cards/:id')
  findOne(@Param('id') id: string) {
    return this.customerCardsService.findById(id);
  }

  @Patch('customer-cards/:id/start-using')
  startUsing(@Param('id') id: string) {
    return this.customerCardsService.markInUse(id);
  }

  @Patch('customer-cards/:id/close')
  close(@Param('id') id: string) {
    return this.customerCardsService.close(id);
  }

  @Patch('customer-cards/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.customerCardsService.cancel(id);
  }

  @Get('restaurants/:restaurantId/customer-cards')
  listByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.customerCardsService.listByRestaurant(restaurantId);
  }
}
