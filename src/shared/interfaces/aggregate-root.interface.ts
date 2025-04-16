export interface AggregateRoot<T> {
  getId(): string;
  getProps(): T;
  equals(other: AggregateRoot<T>): boolean;
  validate(): boolean;
}
