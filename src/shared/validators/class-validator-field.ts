import { validateSync } from 'class-validator';
import {
  FielErrors,
  ValidatorFieldInterface,
} from './validator-field.interface';

// eslint-disable-next-line prettier/prettier
export abstract class ClassValidatorField<T> implements ValidatorFieldInterface<T> {
  errors: FielErrors | null = null;
  validatedData: T | null = null;

  validate(value: Partial<T>): boolean {
    if (!value || typeof value !== 'object') {
      throw new Error('Invalid object for validation');
    }
    const errorsSync = validateSync(value);
    if (errorsSync.length > 0) {
      this.errors = {};
      for (const error of errorsSync) {
        const field = error.property;
        const constraints = error.constraints;
        this.errors[field] = constraints
          ? Object.values(constraints)
          : ['Unknown validation error'];
      }
      return false;
    }

    this.validatedData = value as T;
    this.errors = {};
    return true;
  }
}
