export class ValueObject<T> {
  protected static readonly _type: string = 'ValueObject';
  protected readonly props: T;
  protected constructor(prop: T) {
    this.props = prop;
    Object.freeze(this.props);
    Object.freeze(this);
  }

  getValue(): T {
    return this.props;
  }

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.getValue());
  }
}
