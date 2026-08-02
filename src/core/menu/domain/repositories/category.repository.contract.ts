import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Category } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepositoryContract
  extends RepositoryContract<Category> {
  findByEstablishmentId(establishmentId: string): Promise<Category[]>;
}
