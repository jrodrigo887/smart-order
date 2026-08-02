import { EntityBase } from '@/shared/entities/entity-base';
import { MenuStatus, MenuStatusType } from '../enums/menu-status.enum';

export type MenuProps = {
  establishmentId: string;
  name: string;
  status?: MenuStatusType;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Menu extends EntityBase {
  private constructor(public readonly props: MenuProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.props.status ??= MenuStatus.ACTIVE;
  }

  public static create(props: MenuProps): Menu {
    return new Menu(props);
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get status(): MenuStatusType {
    return this.props.status ?? MenuStatus.ACTIVE;
  }

  public activate(): void {
    this.props.status = MenuStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.status = MenuStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }
}
