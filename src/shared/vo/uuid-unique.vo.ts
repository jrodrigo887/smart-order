export class UuidUnique {
  private constructor(private readonly value: string) {
    if (!UuidUnique.validate(value)) {
      throw new Error('Invalid UUID format');
    }
  }
  public static create(value: string): UuidUnique {
    return new UuidUnique(value);
  }
  public equals(other: UuidUnique): boolean {
    if (!other) return false;
    return this.value === other.value;
  }
  public static validate(uuid?: string): boolean {
    if (!uuid) return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  public getValue(): string {
    return this.value;
  }
}
