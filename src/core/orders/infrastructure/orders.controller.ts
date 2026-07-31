import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CancelOrderItemDto } from '../dto/cancel-order-item.dto';
import { LaunchOrderDto } from '../dto/launch-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  launch(@Body() dto: LaunchOrderDto) {
    return this.ordersService.launch(dto);
  }

  @Get()
  listPending(@Query('establishmentId') establishmentId: string) {
    return this.ordersService.listPendingByEstablishment(establishmentId);
  }

  @Patch(':orderId/items/:itemId/start-preparing')
  startPreparingItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.ordersService.startPreparingItem(orderId, itemId);
  }

  @Patch(':orderId/items/:itemId/mark-prepared')
  markItemPrepared(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.ordersService.markItemPrepared(orderId, itemId);
  }

  @Patch(':orderId/items/:itemId/mark-delivered')
  markItemDelivered(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.ordersService.markItemDelivered(orderId, itemId);
  }

  @Patch(':orderId/items/:itemId/cancel')
  cancelItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() dto: CancelOrderItemDto,
  ) {
    return this.ordersService.cancelItem(orderId, itemId, dto.actor);
  }
}
