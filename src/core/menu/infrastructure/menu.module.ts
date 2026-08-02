import { Module } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../domain/repositories/category.repository.contract';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.contract';
import { MENU_REPOSITORY } from '../domain/repositories/menu.repository.contract';
import { MENU_ITEM_REPOSITORY } from '../domain/repositories/menu-item.repository.contract';
import { PrismaCategoryRepository } from './repositories/prisma-category.repository';
import { PrismaProductRepository } from './repositories/prisma-product.repository';
import { PrismaMenuRepository } from './repositories/prisma-menu.repository';
import { PrismaMenuItemRepository } from './repositories/prisma-menu-item.repository';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';

@Module({
  controllers: [
    CategoriesController,
    ProductsController,
    MenusController,
    MenuItemsController,
  ],
  providers: [
    CategoriesService,
    ProductsService,
    MenusService,
    MenuItemsService,
    { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    { provide: MENU_REPOSITORY, useClass: PrismaMenuRepository },
    { provide: MENU_ITEM_REPOSITORY, useClass: PrismaMenuItemRepository },
  ],
  exports: [CategoriesService, ProductsService, MenusService, MenuItemsService],
})
export class MenuModule {}
