import { createWhoisLookupAction } from './whoisLookup';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

// Mock the whoiser module
jest.mock('whoiser', () => {
  return jest.fn().mockImplementation((domain: string) => {
    if (domain === 'example.com') {
      return Promise.resolve({
        'example.com': {
          registrar: 'IANA',
          registrarUrl: 'https://www.iana.org/',
          createdDate: '1995-08-14T04:00:00Z',
          updatedDate: '2023-08-14T07:01:31Z',
          expiryDate: '2024-08-13T04:00:00Z',
          status: ['clientDeleteProhibited', 'clientTransferProhibited'],
          nameServers: ['a.iana-servers.net', 'b.iana-servers.net'],
        },
      });
    } else if (domain === 'nonexistent.domain') {
      return Promise.resolve({});
    } else if (domain === 'error.domain') {
      throw new Error('Network error');
    }
    return Promise.resolve({
      [domain]: {
        registrar: 'Mock Registrar',
        status: ['active'],
      },
    });
  });
});

describe('createWhoisLookupAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createWhoisLookupAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('lookup-whois');
    expect(registeredAction.title).toBe('Lookup WHOIS');
    expect(registeredAction.description).toBe(
      'Perform WHOIS lookup for domains and IP addresses',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should perform WHOIS lookup for valid domain', async () => {
      const input = { domain: 'example.com' };

      const result = await registeredAction.action({ input });

      expect(result.output.data).toBeDefined();
      expect(result.output.data['example.com']).toBeDefined();
      expect(result.output.data['example.com'].registrar).toBe('IANA');
      expect(result.output.data['example.com'].status).toEqual([
        'clientDeleteProhibited',
        'clientTransferProhibited',
      ]);
    });

    it('should handle domain with whitespace', async () => {
      const input = { domain: '  example.com  ' };

      const result = await registeredAction.action({ input });

      expect(result.output.data).toBeDefined();
      expect(result.output.data['example.com']).toBeDefined();
    });

    it('should handle nonexistent domain', async () => {
      const input = { domain: 'nonexistent.domain' };

      const result = await registeredAction.action({ input });

      expect(result.output.data).toEqual({});
    });

    it('should throw error for empty domain', async () => {
      const input = { domain: '' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        'Domain is required',
      );
    });

    it('should throw error for whitespace-only domain', async () => {
      const input = { domain: '   ' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        'Domain is required',
      );
    });

    it('should handle network errors', async () => {
      const input = { domain: 'error.domain' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to perform WHOIS lookup/,
      );
    });

    it('should handle IP address lookup', async () => {
      const input = { domain: '8.8.8.8' };

      const result = await registeredAction.action({ input });

      expect(result.output.data).toBeDefined();
      expect(result.output.data['8.8.8.8']).toBeDefined();
    });

    it('should handle subdomain lookup', async () => {
      const input = { domain: 'subdomain.example.com' };

      const result = await registeredAction.action({ input });

      expect(result.output.data).toBeDefined();
      expect(result.output.data['subdomain.example.com']).toBeDefined();
    });
  });
});
