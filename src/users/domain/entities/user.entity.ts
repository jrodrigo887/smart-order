import { EntityValidatorError } from '@/shared/errors/entity-validator-error';
import { EntityBase } from '../../../shared/entities/entity-base';
import { UserValidatorFactory } from '../validators/user.validator';

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
    User.validator(props);
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

  updateName(name: string) {
    User.validator({ ...this.props, name });
    this.props.name = name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
  updatePassword(password: string) {
    User.validator({ ...this.props, password });
    this.props.password = password;
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

  public static validator(props: UserProps) {
    const userValidtor = UserValidatorFactory.create();
    const isValid = userValidtor.validate(props);
    if (!isValid) {
      throw new EntityValidatorError(userValidtor.errors!);
    }
    return isValid;
  }
}
