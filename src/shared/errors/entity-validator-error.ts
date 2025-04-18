import { FielErrors } from '../validators/validator-field.interface';
export class ValidationError extends Error {}

export class EntityValidatorError extends Error {
  constructor(public errors: FielErrors) {
    super('Entity validation error');
    this.errors = errors;
    this.name = 'EntityValidatorError';
  }
}
