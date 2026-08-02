import { EntityBase } from '@/shared/entities/entity-base';
import { ProductStatus, ProductStatusType } from '../enums/product-status.enum';

export type ProductProps = {
  establishmentId: string;
  categoryId: string;
  name: string;
  basePrice: number;
  description?: string;
  sku?: string;
  tags?: string[];
  status?: ProductStatusType;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product extends EntityBase {
  private constructor(public readonly props: ProductProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.props.status ??= ProductStatus.ACTIVE;
    this.props.tags ??= [];
  }

  public static create(props: ProductProps): Product {
    return new Product(props);
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }

  public get categoryId(): string {
    return this.props.categoryId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get sku(): string | undefined {
    return this.props.sku;
  }

  public get basePrice(): number {
    return this.props.basePrice;
  }

  public get tags(): string[] {
    return this.props.tags ?? [];
  }

  public get status(): ProductStatusType {
    return this.props.status ?? ProductStatus.ACTIVE;
  }

  public discontinue(): void {
    this.props.status = ProductStatus.DISCONTINUED;
    this.props.updatedAt = new Date();
  }

  public reactivate(): void {
    this.props.status = ProductStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }
}
