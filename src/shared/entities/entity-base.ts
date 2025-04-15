import { v4 as uuidv4 } from 'uuid';
import { UuidUnique } from '../vo/uuid-unique.vo';

type Values = { id: string; createdAt: Date; updatedAt: Date };

export abstract class EntityBase {
  _id: UuidUnique;
  _createdAt: Date;
  _updatedAt?: Date | null;

  constructor(values: Partial<Values>) {
    this._id = UuidUnique.validate(values.id)
      ? UuidUnique.create(values.id!)
      : UuidUnique.create(uuidv4());
    this._createdAt = values.createdAt || new Date();
    this._updatedAt = values.updatedAt || null;
  }

  get id(): string {
    return this._id.getValue();
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | null | undefined {
    return this._updatedAt;
  }

  public set updatedAt(upd: Date) {
    this._updatedAt = upd;
  }
}
