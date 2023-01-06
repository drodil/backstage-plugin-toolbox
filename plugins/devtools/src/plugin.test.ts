import { devtoolsPlugin } from './plugin';

describe('devtools', () => {
  it('should export plugin', () => {
    expect(devtoolsPlugin).toBeDefined();
  });
});
