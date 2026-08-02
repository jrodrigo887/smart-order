import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('establishments/:establishmentId/products')
  listByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.productsService.listByEstablishment(establishmentId);
  }

  @Patch('products/:id/discontinue')
  discontinue(@Param('id') id: string) {
    return this.productsService.discontinue(id);
  }

  @Patch('products/:id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.productsService.reactivate(id);
  }
}
