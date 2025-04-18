import { v4 as uuidv4 } from 'uuid';
import { UuidUnique } from '../vo/uuid-unique.vo';

export type EntityProps = { id: string; createdAt: Date; updatedAt: Date };

export abstract class EntityBase {
  private _id: UuidUnique;
  private _createdAt: Date;
  private _updatedAt?: Date | null;

  constructor(public readonly props: Partial<EntityProps>) {
    this._id = UuidUnique.validate(props.id)
      ? UuidUnique.create(props.id!)
      : UuidUnique.create(uuidv4());
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || null;
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
