import { EntityBase } from '@/shared/entities/entity-base';
import {
  MenuItemStatus,
  MenuItemStatusType,
} from '../enums/menu-item-status.enum';

export type MenuItemProps = {
  menuId: string;
  productId: string;
  price: number;
  status?: MenuItemStatusType;
  displayOrder?: number;
  featured?: boolean;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class MenuItem extends EntityBase {
  private constructor(public readonly props: MenuItemProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.props.status ??= MenuItemStatus.AVAILABLE;
    this.props.displayOrder ??= 0;
    this.props.featured ??= false;
  }

  public static create(props: MenuItemProps): MenuItem {
    return new MenuItem(props);
  }

  public get menuId(): string {
    return this.props.menuId;
  }

  public get productId(): string {
    return this.props.productId;
  }

  public get price(): number {
    return this.props.price;
  }

  public get status(): MenuItemStatusType {
    return this.props.status ?? MenuItemStatus.AVAILABLE;
  }

  public get displayOrder(): number {
    return this.props.displayOrder ?? 0;
  }

  public get featured(): boolean {
    return this.props.featured ?? false;
  }

  public markAvailable(): void {
    this.props.status = MenuItemStatus.AVAILABLE;
    this.props.updatedAt = new Date();
  }

  public markUnavailable(): void {
    this.props.status = MenuItemStatus.UNAVAILABLE;
    this.props.updatedAt = new Date();
  }

  public updatePrice(price: number): void {
    this.props.price = price;
    this.props.updatedAt = new Date();
  }

  public updateDisplay(displayOrder: number, featured: boolean): void {
    this.props.displayOrder = displayOrder;
    this.props.featured = featured;
    this.props.updatedAt = new Date();
  }
}
