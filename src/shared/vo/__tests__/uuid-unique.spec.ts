import { UuidUnique } from '../uuid-unique.vo';

describe('UUID', () => {
  it('should create a valid UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const uuidUnique = UuidUnique.create(uuid);
    expect(uuidUnique.getValue()).toBe(uuid);
  });

  it('should throw an error for invalid UUID', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => UuidUnique.create(invalidUuid)).toThrow('Invalid UUID format');
  });

  it('should validate a valid UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(UuidUnique.validate(uuid)).toBe(true);
  });

  it('should invalidate an invalid UUID', () => {
    const invalidUuid = 'invalid-uuid';
    expect(UuidUnique.validate(invalidUuid)).toBe(false);
  });

  it('should equal UUID', () => {
    const Uuid = UuidUnique.create('123e4567-e89b-12d3-a456-426614174000');
    const Uuid2 = UuidUnique.create('123e4567-e89b-12d3-a456-426614174000');

    expect(Uuid.equals(Uuid2)).toBe(true);
  });
  it('should return false compare property null', () => {
    const Uuid = UuidUnique.create('123e4567-e89b-12d3-a456-426614174000');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(Uuid.equals(null as any)).toBe(false);
  });
});
