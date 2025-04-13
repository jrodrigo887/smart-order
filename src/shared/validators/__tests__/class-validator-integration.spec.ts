import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ClassValidatorField } from '../class-validator-field';

class StubUserDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  constructor(...args: StubUserDTO[]) {
    Object.assign(this, args);
  }
}

class StubClassValidator extends ClassValidatorField<StubUserDTO> {
  validate(value: StubUserDTO): boolean {
    return super.validate(value);
  }
}

describe('ClassValidatorIntegration', () => {
  let sut: StubClassValidator;

  beforeEach(() => {
    sut = new StubClassValidator();
  });
  it('should return false with zero properties using class-validator', () => {
    expect(sut.validate(new StubUserDTO())).toBeFalsy();
  });

  it('should handle missing properties return proper errors', () => {
    const emptyInstance = new StubUserDTO();
    const isValid = sut.validate(emptyInstance);
    expect(isValid).toBe(false);
    expect(sut.errors).toStrictEqual({
      email: ['Email is required', 'email must be an email'],
      name: ['Name is required', 'name must be a string'],
    });
  });

  it('should throw or fail gracefully when input is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => sut.validate(null as any)).toThrow(
      'Invalid object for validation',
    );
  });

  it('should throw or fail gracefully when input is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => sut.validate(undefined as any)).toThrow(
      'Invalid object for validation',
    );
  });
});
