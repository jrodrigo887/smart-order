import { faker } from '@faker-js/faker/.';
import { CustomerCardStatus } from '../../enums/customer-card-status.enum';
import { CustomerCardStatusError } from '../../errors/customer-card-status.error';
import { CustomerCard, CustomerCardProps } from '../customer-card.entity';

describe('CustomerCardEntity', () => {
  let customerCard: CustomerCard;
  let userProps: CustomerCardProps;
  beforeEach(() => {
    userProps = {
      id: faker.string.uuid(),
      waiterId: faker.string.uuid(),
      restaurantId: faker.string.uuid(),
      cardNumber: 123,
      status: CustomerCardStatus.OPEN,
      createdAt: new Date(),
      openedAt: new Date(),
      closedAt: null,
      updatedAt: new Date(),
    };
    customerCard = CustomerCard.create(userProps);
  });
  it('should create a valid CustomerCardEntity instance', () => {
    expect(customerCard).toBeInstanceOf(CustomerCard);
  });
  it('should have the correct properties', () => {
    expect(customerCard.cardNumber).toEqual(userProps.cardNumber);
    expect(customerCard.waiterId).toEqual(userProps.waiterId);
    expect(customerCard.restaurantId).toEqual(userProps.restaurantId);
    expect(customerCard.openedAt).toEqual(userProps.openedAt);
    expect(customerCard.closedAt).toEqual(userProps.closedAt);
    expect(customerCard.status).toEqual(userProps.status);
  });
  it('should close the card', () => {
    customerCard.close();
    expect(customerCard.closedAt).not.toBeNull();
    expect(customerCard.status).toEqual(CustomerCardStatus.CLOSED);
  });
  it('update waiterID', () => {
    const newWaiterId = faker.string.uuid();
    customerCard.updateWaiterId(newWaiterId);
    expect(customerCard.waiterId).toEqual(newWaiterId);
  });
  it('should check if the card wis open', () => {
    expect(customerCard.isOpen()).toBe(true);
    customerCard.close();
    expect(customerCard.isOpen()).toBe(false);
  });

  it('should start using the card, going from OPEN to IN_USE', () => {
    customerCard.startUsing();
    expect(customerCard.status).toEqual(CustomerCardStatus.IN_USE);
  });

  it('should not start using a card that is not OPEN', () => {
    customerCard.startUsing();
    expect(() => customerCard.startUsing()).toThrow(CustomerCardStatusError);
  });

  it('should cancel an OPEN card with no time restriction', () => {
    customerCard.cancel();
    expect(customerCard.status).toEqual(CustomerCardStatus.CANCELED);
    expect(customerCard.closedAt).not.toBeNull();
  });

  it('should cancel an IN_USE card within 30 minutes of the first Order', () => {
    const firstOrderAt = new Date();
    customerCard.startUsing(firstOrderAt);
    const now = new Date(firstOrderAt.getTime() + 29 * 60 * 1000);
    customerCard.cancel(now);
    expect(customerCard.status).toEqual(CustomerCardStatus.CANCELED);
  });

  it('should not cancel a card more than 30 minutes after the first Order', () => {
    const firstOrderAt = new Date();
    customerCard.startUsing(firstOrderAt);
    const now = new Date(firstOrderAt.getTime() + 31 * 60 * 1000);
    expect(() => customerCard.cancel(now)).toThrow(CustomerCardStatusError);
    expect(customerCard.status).toEqual(CustomerCardStatus.IN_USE);
  });

  it('should record firstOrderAt when starting to use the card', () => {
    const firstOrderAt = new Date();
    customerCard.startUsing(firstOrderAt);
    expect(customerCard.firstOrderAt).toEqual(firstOrderAt);
  });

  it.each([
    ['close', () => customerCard.close()],
    ['cancel', () => customerCard.cancel()],
    ['updateWaiterId', () => customerCard.updateWaiterId(faker.string.uuid())],
  ])('should not %s an already CLOSED card', (_action, act) => {
    customerCard.close();
    expect(act).toThrow(CustomerCardStatusError);
  });

  it.each([
    ['close', () => customerCard.close()],
    ['cancel', () => customerCard.cancel()],
    ['updateWaiterId', () => customerCard.updateWaiterId(faker.string.uuid())],
  ])('should not %s an already CANCELED card', (_action, act) => {
    customerCard.cancel();
    expect(act).toThrow(CustomerCardStatusError);
  });
});
