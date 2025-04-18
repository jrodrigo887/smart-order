import { EntityBase } from '../entities/entity-base';
import { NotFoundError } from '../errors/not-found.error';
import { RepositoryContract } from './contracts/repository.contract';

export abstract class InMemoryRepository<T extends EntityBase>
  implements RepositoryContract<T>
{
  private items: T[] = [];
  findById(id: string): Promise<T> {
    const item = this._getById(id);
    return Promise.resolve<T>(item);
  }

  findAll(): Promise<T[]> {
    return Promise.resolve(this.items);
  }

  create(data: T): Promise<T> {
    const newItem = { ...data };
    this.items.push(data);
    return Promise.resolve(newItem);
  }

  update(id: string, data: Partial<T>): Promise<T> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    const updatedItem = { ...this.items[index], ...data };
    this.items[index] = updatedItem;
    return Promise.resolve(updatedItem);
  }

  delete(id: string): Promise<void> {
    this._getById(id);
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return Promise.resolve();
  }
  private _getById(id: string): T {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
    return item;
  }
}
