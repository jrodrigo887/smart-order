import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenusService } from './menus.service';

@Controller()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('menus')
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Get('menus/:id')
  findOne(@Param('id') id: string) {
    return this.menusService.findById(id);
  }

  @Get('establishments/:establishmentId/menus')
  listByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.menusService.listByEstablishment(establishmentId);
  }

  @Patch('menus/:id/activate')
  activate(@Param('id') id: string) {
    return this.menusService.activate(id);
  }

  @Patch('menus/:id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.menusService.deactivate(id);
  }
}
