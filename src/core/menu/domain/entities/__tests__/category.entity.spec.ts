import { faker } from '@faker-js/faker';
import { Category, CategoryProps } from '../category.entity';

describe('CategoryEntity', () => {
  let props: CategoryProps;
  let category: Category;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      establishmentId: faker.string.uuid(),
      name: faker.commerce.department(),
    };
    category = Category.create(props);
  });

  it('should create a valid Category instance', () => {
    expect(category).toBeInstanceOf(Category);
    expect(category.establishmentId).toEqual(props.establishmentId);
    expect(category.name).toEqual(props.name);
  });
});
