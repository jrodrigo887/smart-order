import { faker } from '@faker-js/faker';
import { CustomerCardStatus } from '../../domain/enums/customer-card-status.enum';
import { CustomerCardStatusError } from '../../domain/errors/customer-card-status.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryCustomerCardRepository } from '../repositories/in-memory-customer-card.repository';
import { CustomerCardsService } from '../customer-cards.service';

describe('CustomerCardsService', () => {
  let sut: CustomerCardsService;
  let repository: InMemoryCustomerCardRepository;
  let input: { cardNumber: number; waiterId: string; restaurantId: string };

  beforeEach(() => {
    repository = new InMemoryCustomerCardRepository();
    sut = new CustomerCardsService(repository);
    input = {
      cardNumber: faker.number.int({ min: 1, max: 999 }),
      waiterId: faker.string.uuid(),
      restaurantId: faker.string.uuid(),
    };
  });

  it('should find a CustomerCard by id', async () => {
    const opened = await sut.open(input);

    const found = await sut.findById(opened.id);

    expect(found.id).toEqual(opened.id);
  });

  it('should open a new CustomerCard in OPEN status', async () => {
    const customerCard = await sut.open(input);

    expect(customerCard.id).toBeDefined();
    expect(customerCard.cardNumber).toEqual(input.cardNumber);
    expect(customerCard.waiterId).toEqual(input.waiterId);
    expect(customerCard.restaurantId).toEqual(input.restaurantId);
    expect(customerCard.status).toEqual(CustomerCardStatus.OPEN);
  });

  it('should create a new CustomerCard (new id) for every open, even for the same cardNumber', async () => {
    const first = await sut.open(input);
    const second = await sut.open(input);

    expect(first.id).not.toEqual(second.id);
  });

  it('should transition an OPEN CustomerCard to IN_USE', async () => {
    const opened = await sut.open(input);

    const inUse = await sut.markInUse(opened.id);

    expect(inUse.status).toEqual(CustomerCardStatus.IN_USE);
  });

  it('should close a CustomerCard', async () => {
    const opened = await sut.open(input);

    const closed = await sut.close(opened.id);

    expect(closed.status).toEqual(CustomerCardStatus.CLOSED);
    expect(closed.closedAt).not.toBeNull();
  });

  it('should cancel an OPEN CustomerCard with no time restriction', async () => {
    const opened = await sut.open(input);

    const canceled = await sut.cancel(opened.id);

    expect(canceled.status).toEqual(CustomerCardStatus.CANCELED);
  });

  it('should cancel an IN_USE CustomerCard within 30 minutes of the first Order', async () => {
    const opened = await sut.open(input);
    const firstOrderAt = new Date();
    await sut.markInUse(opened.id, firstOrderAt);
    const now = new Date(firstOrderAt.getTime() + 10 * 60 * 1000);

    const canceled = await sut.cancel(opened.id, now);

    expect(canceled.status).toEqual(CustomerCardStatus.CANCELED);
  });

  it('should not cancel a CustomerCard more than 30 minutes after the first Order', async () => {
    const opened = await sut.open(input);
    const firstOrderAt = new Date();
    await sut.markInUse(opened.id, firstOrderAt);
    const now = new Date(firstOrderAt.getTime() + 31 * 60 * 1000);

    await expect(sut.cancel(opened.id, now)).rejects.toThrow(
      CustomerCardStatusError,
    );
  });

  it('should not close an already CLOSED CustomerCard', async () => {
    const opened = await sut.open(input);
    await sut.close(opened.id);

    await expect(sut.close(opened.id)).rejects.toThrow(CustomerCardStatusError);
  });

  it('should throw NotFoundError when acting on an unknown id', async () => {
    await expect(sut.close(faker.string.uuid())).rejects.toThrow(NotFoundError);
  });

  it('should list only CustomerCards from the given restaurant', async () => {
    const opened = await sut.open(input);
    await sut.open({ ...input, restaurantId: faker.string.uuid() });

    const result = await sut.listByRestaurant(input.restaurantId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(opened.id);
  });
});
