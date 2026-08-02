import { faker } from '@faker-js/faker';
import { Product, ProductProps } from '../product.entity';
import { ProductStatus } from '../../enums/product-status.enum';

describe('ProductEntity', () => {
  let props: ProductProps;
  let product: Product;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      establishmentId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
      name: faker.commerce.productName(),
      basePrice: 19.9,
    };
    product = Product.create(props);
  });

  it('should create a valid Product instance', () => {
    expect(product).toBeInstanceOf(Product);
    expect(product.establishmentId).toEqual(props.establishmentId);
    expect(product.categoryId).toEqual(props.categoryId);
    expect(product.name).toEqual(props.name);
    expect(product.basePrice).toEqual(props.basePrice);
  });

  it('should default to ACTIVE status and empty tags', () => {
    expect(product.status).toEqual(ProductStatus.ACTIVE);
    expect(product.tags).toEqual([]);
  });

  it('should discontinue a Product', () => {
    product.discontinue();
    expect(product.status).toEqual(ProductStatus.DISCONTINUED);
  });

  it('should reactivate a discontinued Product', () => {
    product.discontinue();
    product.reactivate();
    expect(product.status).toEqual(ProductStatus.ACTIVE);
  });
});
