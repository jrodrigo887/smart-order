import { faker } from '@faker-js/faker/.';
import { CustomerCardStatusEnum } from '../../enums/customer-card-status.enum';
import { CustomerCard, CustomerCardProps } from '../customer-card.entity';

describe('CustomerCardEntity', () => {
  let customerCard: CustomerCard;
  let userProps: CustomerCardProps;
  beforeEach(() => {
    userProps = {
      id: faker.string.uuid(),
      waiterId: faker.string.uuid(),
      cardNumber: 123,
      status: CustomerCardStatusEnum.OPEN,
      createdAt: new Date(),
      openedAt: new Date(),
      closedAt: new Date(),
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
    expect(customerCard.openedAt).toEqual(userProps.openedAt);
    expect(customerCard.closedAt).toEqual(userProps.closedAt);
    expect(customerCard.status).toEqual(userProps.status);
  });
  it('should close the card', () => {
    customerCard.close();
    expect(customerCard.closedAt).not.toBeNull();
    expect(customerCard.status).toEqual(CustomerCardStatusEnum.CLOSED);
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
});
