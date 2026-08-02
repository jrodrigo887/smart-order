import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryContract,
} from '../domain/repositories/product.repository.contract';

export type CreateProductInput = {
  establishmentId: string;
  categoryId: string;
  name: string;
  description?: string;
  sku?: string;
  basePrice: number;
  tags?: string[];
};

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryContract,
  ) {}

  async create(input: CreateProductInput): Promise<Product> {
    const product = Product.create(input);
    return this.repository.create(product);
  }

  async findById(id: string): Promise<Product> {
    return this.repository.findById(id);
  }

  async listByEstablishment(establishmentId: string): Promise<Product[]> {
    return this.repository.findByEstablishmentId(establishmentId);
  }

  async discontinue(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    product.discontinue();
    return this.repository.update(id, product);
  }

  async reactivate(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    product.reactivate();
    return this.repository.update(id, product);
  }
}
