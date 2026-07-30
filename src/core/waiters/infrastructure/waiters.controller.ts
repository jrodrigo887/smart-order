import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LinkUserDto } from '../dto/link-user.dto';
import { RegisterWaiterDto } from '../dto/register-waiter.dto';
import { WaitersService } from './waiters.service';

@Controller()
export class WaitersController {
  constructor(private readonly waitersService: WaitersService) {}

  @Post('waiters')
  register(@Body() dto: RegisterWaiterDto) {
    return this.waitersService.register(dto);
  }

  @Get('waiters/:id')
  findOne(@Param('id') id: string) {
    return this.waitersService.findById(id);
  }

  @Patch('waiters/:id/link-user')
  linkUser(@Param('id') id: string, @Body() dto: LinkUserDto) {
    return this.waitersService.linkUser(id, dto.userId);
  }

  @Get('restaurants/:restaurantId/waiters')
  listByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.waitersService.listByRestaurant(restaurantId);
  }
}
