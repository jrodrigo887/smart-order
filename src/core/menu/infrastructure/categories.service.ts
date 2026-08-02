import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepositoryContract,
} from '../domain/repositories/category.repository.contract';

export type CreateCategoryInput = {
  establishmentId: string;
  name: string;
};

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: CategoryRepositoryContract,
  ) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const category = Category.create(input);
    return this.repository.create(category);
  }

  async findById(id: string): Promise<Category> {
    return this.repository.findById(id);
  }

  async listByEstablishment(establishmentId: string): Promise<Category[]> {
    return this.repository.findByEstablishmentId(establishmentId);
  }
}
