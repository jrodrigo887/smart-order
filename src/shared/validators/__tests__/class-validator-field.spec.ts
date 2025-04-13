import * as classValidator from 'class-validator';
import { ClassValidatorField } from '../class-validator-field';
class StubValidatorField extends ClassValidatorField<{ field: string }> {}

describe('ClassValidatorField', () => {
  it('should validate correctly', () => {
    // Arrange
    const stubValidator = new StubValidatorField();

    expect(stubValidator).toBeInstanceOf(ClassValidatorField);
    expect(stubValidator).toHaveProperty('errors');
    expect(stubValidator).toHaveProperty('validatedData');
    expect(stubValidator).toHaveProperty('validate');
    expect(stubValidator.errors).toBeNull();
    expect(stubValidator.validatedData).toBeNull();
  });

  it('should return errors when validation fails', () => {
    // Arrange
    const sut = new StubValidatorField();
    const invalidValue = { field: ['field must not be empty'] };
    const validateSyncMock = jest.spyOn(classValidator, 'validateSync');

    validateSyncMock.mockReturnValue([
      {
        property: 'field',
        constraints: {
          isNotEmpty: 'field must not be empty',
        },
      },
    ]);
    expect(sut.validate({ field: '' })).toBe(false);
    expect(validateSyncMock).toHaveBeenCalled();
    expect(sut.validatedData).toBeNull();
    expect(sut.errors).toStrictEqual(invalidValue);
  });

  it('should validate without errors', () => {
    // Arrange
    const sut = new StubValidatorField();

    const validateSyncMock = jest.spyOn(classValidator, 'validateSync');
    validateSyncMock.mockReturnValue([]);

    expect(sut.validate({ field: 'Que coisa!' })).toBeTruthy();
    expect(validateSyncMock).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field: 'Que coisa!' });
    expect(sut.errors).toStrictEqual({});
  });

  it('should error type constructor', () => {
    // Arrange
    const sut = new StubValidatorField();

    const validateSyncMock = jest.spyOn(classValidator, 'validateSync');
    validateSyncMock.mockReturnValue([]);

    expect(sut.validate({ field: 'Que coisa!' })).toBeTruthy();
    expect(validateSyncMock).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field: 'Que coisa!' });
    expect(sut.errors).toStrictEqual({});
  });
  it('[Unknown validation error]', () => {
    // Arrange
    const sut = new StubValidatorField();
    const fakerError = [
      {
        property: 'tropa',
        constraints: undefined,
      },
    ];
    const validateSyncMock = jest.spyOn(classValidator, 'validateSync');
    validateSyncMock.mockReturnValue(fakerError);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(sut.validate({ field: 'Que coisa!' } as any)).toBeFalsy();
    expect(validateSyncMock).toHaveBeenCalled();
    expect(sut.errors).toStrictEqual({
      tropa: ['Unknown validation error'],
    });
  });
});
