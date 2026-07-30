import * as path from 'path';

describe('root entrypoint', () => {
  it('does not pull in any @nestjs/* module', () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../index');

    const nestModules = Object.keys(require.cache).filter((modulePath) =>
      modulePath.includes(`${path.sep}node_modules${path.sep}@nestjs${path.sep}`),
    );

    expect(nestModules).toEqual([]);
  });
});
