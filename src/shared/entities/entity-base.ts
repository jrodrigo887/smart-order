import { v4 as uuidv4 } from 'uuid';

type Values = { id: string; createdAt: Date; updatedAt: Date };

export abstract class EntityBase {
  _id: string;
  _createdAt: Date;
  _updatedAt?: Date | null;

  constructor(values: Partial<Values>) {
    this._createdAt = values.createdAt || new Date();
    this._updatedAt = values.updatedAt || null;
    this._id = values.id || uuidv4();
  }
  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | null | undefined {
    return this._updatedAt;
  }
}
