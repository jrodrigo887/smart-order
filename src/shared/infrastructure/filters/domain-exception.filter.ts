import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomerCardStatusError } from '@/core/customer-cards/domain/errors/customer-card-status.error';
import { OrderItemStatusError } from '@/core/orders/domain/errors/order-item-status.error';
import { OrderValidationError } from '@/core/orders/domain/errors/order-validation.error';
import { UnauthorizedCancellationError } from '@/core/orders/domain/errors/unauthorized-cancellation.error';
import { EntityValidatorError } from '@/shared/errors/entity-validator-error';
import { NotFoundError } from '@/shared/errors/not-found.error';

const STATUS_BY_ERROR = new Map<new (...args: unknown[]) => Error, HttpStatus>([
  [NotFoundError, HttpStatus.NOT_FOUND],
  [UnauthorizedCancellationError, HttpStatus.FORBIDDEN],
  [OrderValidationError, HttpStatus.BAD_REQUEST],
  [EntityValidatorError, HttpStatus.BAD_REQUEST],
  [OrderItemStatusError, HttpStatus.CONFLICT],
  [CustomerCardStatusError, HttpStatus.CONFLICT],
]);

@Catch(
  NotFoundError,
  UnauthorizedCancellationError,
  OrderValidationError,
  EntityValidatorError,
  OrderItemStatusError,
  CustomerCardStatusError,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      STATUS_BY_ERROR.get(
        exception.constructor as new (...args: unknown[]) => Error,
      ) ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
