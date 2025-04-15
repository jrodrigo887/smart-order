import { EntityBase } from '../../../shared/entities/entity-base';

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User extends EntityBase {
  constructor(private readonly props: UserProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }
  public getProp = () => this.props;

  get name(): string {
    return this.props.name;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }

  get id() {
    return super.id;
  }

  get createdAt(): Date {
    return super.createdAt;
  }
  get updatedAt(): Date | undefined | null {
    return super.updatedAt;
  }
}
