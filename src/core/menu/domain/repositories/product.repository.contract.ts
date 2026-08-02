import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepositoryContract extends RepositoryContract<Product> {
  findByEstablishmentId(establishmentId: string): Promise<Product[]>;
}
