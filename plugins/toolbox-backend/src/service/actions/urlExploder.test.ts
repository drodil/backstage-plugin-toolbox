import { createUrlExploderAction } from './urlExploder';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createUrlExploderAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createUrlExploderAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('explode-url');
    expect(registeredAction.title).toBe('Explode URL');
    expect(registeredAction.description).toBe(
      'Parse URLs and extract their components',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should parse basic URL components', async () => {
      const input = {
        url: 'https://example.com:8080/path/to/resource?param=value#section',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.protocol).toBe('https:');
      expect(result.output.hostname).toBe('example.com');
      expect(result.output.port).toBe('8080');
      expect(result.output.pathname).toBe('/path/to/resource');
      expect(result.output.search).toBe('?param=value');
      expect(result.output.hash).toBe('#section');
      expect(result.output.origin).toBe('https://example.com:8080');
    });

    it('should parse URL with authentication', async () => {
      const input = { url: 'https://user:pass@example.com/path' };

      const result = await registeredAction.action({ input });

      expect(result.output.protocol).toBe('https:');
      expect(result.output.hostname).toBe('example.com');
      expect(result.output.username).toBe('user');
      expect(result.output.password).toBe('pass');
      expect(result.output.pathname).toBe('/path');
    });

    it('should parse query parameters', async () => {
      const input = {
        url: 'https://example.com/search?q=test&page=1&sort=date',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.searchParams).toHaveLength(3);
      expect(result.output.searchParams).toContainEqual({
        key: 'q',
        value: 'test',
      });
      expect(result.output.searchParams).toContainEqual({
        key: 'page',
        value: '1',
      });
      expect(result.output.searchParams).toContainEqual({
        key: 'sort',
        value: 'date',
      });
    });

    it('should handle URL without port', async () => {
      const input = { url: 'https://example.com/path' };

      const result = await registeredAction.action({ input });

      expect(result.output.protocol).toBe('https:');
      expect(result.output.hostname).toBe('example.com');
      expect(result.output.port).toBe('');
      expect(result.output.origin).toBe('https://example.com');
    });

    it('should handle URL without query parameters', async () => {
      const input = { url: 'https://example.com/path' };

      const result = await registeredAction.action({ input });

      expect(result.output.search).toBe('');
      expect(result.output.searchParams).toHaveLength(0);
    });

    it('should handle URL without hash', async () => {
      const input = { url: 'https://example.com/path' };

      const result = await registeredAction.action({ input });

      expect(result.output.hash).toBe('');
    });

    it('should handle root path URL', async () => {
      const input = { url: 'https://example.com/' };

      const result = await registeredAction.action({ input });

      expect(result.output.pathname).toBe('/');
    });

    it('should handle different protocols', async () => {
      const protocols = ['http:', 'ftp:', 'file:'];

      for (const protocol of protocols) {
        const url =
          protocol === 'file:'
            ? 'file:///path/to/file'
            : `${protocol}//example.com/path`;
        const result = await registeredAction.action({ input: { url } });
        expect(result.output.protocol).toBe(protocol);
      }
    });

    it('should throw error for invalid URL', async () => {
      const input = { url: 'not-a-valid-url' };

      await expect(registeredAction.action({ input })).rejects.toThrow();
    });

    it('should handle URL with encoded characters', async () => {
      const input = {
        url: 'https://example.com/path%20with%20spaces?param=%20value%20',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.pathname).toBe('/path%20with%20spaces');
      expect(result.output.searchParams).toContainEqual({
        key: 'param',
        value: ' value ',
      });
    });
  });
});
