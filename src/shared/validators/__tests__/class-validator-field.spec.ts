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
    const invalidValue = { field: ['field must not be empty'] };
    const validateSyncMock = jest.spyOn(classValidator, 'validateSync');
    validateSyncMock.mockReturnValue([]);

    expect(sut.validate(invalidValue)).toBeTruthy();
    expect(validateSyncMock).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual(invalidValue);
    expect(sut.errors).toStrictEqual({});
  });
});
