import { EntityBase } from '@/shared/entities/entity-base';

export type CategoryProps = {
  establishmentId: string;
  name: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Category extends EntityBase {
  private constructor(public readonly props: CategoryProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: CategoryProps): Category {
    return new Category(props);
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }

  public get name(): string {
    return this.props.name;
  }
}
