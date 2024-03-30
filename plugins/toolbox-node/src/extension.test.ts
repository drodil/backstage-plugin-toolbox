import { toolboxToolExtensionPoint } from './extension';

describe('extension', () => {
  it('should export extension', () => {
    expect(toolboxToolExtensionPoint).toBeDefined();
  });
});
