export type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  constructor(private readonly props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }
  public getProp = () => this.props;
}
