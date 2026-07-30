// async without await is intentional: it turns synchronous throws into promise rejections, matching RepositoryContract's Promise-based error handling
/* eslint-disable @typescript-eslint/require-await */
import { EntityBase } from '../entities/entity-base';
import { NotFoundError } from '../errors/not-found.error';
import { RepositoryContract } from './contracts/repository.contract';

export abstract class InMemoryRepository<T extends EntityBase>
  implements RepositoryContract<T>
{
  private items: T[] = [];
  async findById(id: string): Promise<T> {
    return this._getById(id);
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async create(data: T): Promise<T> {
    this.items.push(data);
    return data;
  }

  async update(id: string, data: T): Promise<T> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
    this.items[index] = data;
    return data;
  }

  async delete(id: string): Promise<void> {
    this._getById(id);
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
  private _getById(id: string): T {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
    return item;
  }
}
