import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AddMenuItemDto } from '../dto/add-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { MenuItemsService } from './menu-items.service';

@Controller()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post('menu-items')
  add(@Body() dto: AddMenuItemDto) {
    return this.menuItemsService.add(dto);
  }

  @Get('menus/:menuId/menu-items')
  listByMenu(@Param('menuId') menuId: string) {
    return this.menuItemsService.listByMenu(menuId);
  }

  @Patch('menu-items/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemsService.update(id, dto);
  }

  @Patch('menu-items/:id/mark-available')
  markAvailable(@Param('id') id: string) {
    return this.menuItemsService.markAvailable(id);
  }

  @Patch('menu-items/:id/mark-unavailable')
  markUnavailable(@Param('id') id: string) {
    return this.menuItemsService.markUnavailable(id);
  }
}
