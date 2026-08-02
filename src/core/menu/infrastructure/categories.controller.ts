import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('categories')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get('categories/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Get('establishments/:establishmentId/categories')
  listByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.categoriesService.listByEstablishment(establishmentId);
  }
}
