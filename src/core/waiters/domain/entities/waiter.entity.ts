import { EntityBase } from '@/shared/entities/entity-base';
import { UuidUnique } from '@shared/vo/uuid-unique.vo';

export type WaiterProps = {
  name: string;
  restaurantId: string;
  userId?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Waiter extends EntityBase {
  private constructor(public readonly props: WaiterProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: WaiterProps): Waiter {
    return new Waiter(props);
  }

  public get name(): string {
    return this.props.name;
  }

  public get restaurantId(): string {
    return this.props.restaurantId;
  }

  public get userId(): string | undefined {
    return this.props.userId;
  }

  public linkUser(userId: string): void {
    const validId = UuidUnique.create(userId);
    this.props.userId = validId.getValue();
    this.props.updatedAt = new Date();
  }
}
