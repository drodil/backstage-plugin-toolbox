import { createCidrCalculatorAction } from './cidrCalculator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createCidrCalculatorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createCidrCalculatorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('calculate-cidr');
    expect(registeredAction.title).toBe('Calculate CIDR');
    expect(registeredAction.description).toBe(
      'Calculate network information from CIDR notation',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should calculate CIDR for /24 network', async () => {
      const input = { cidr: '192.168.1.0/24' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('192.168.1.0');
      expect(result.output.broadcastAddress).toBe('192.168.1.255');
      expect(result.output.firstUsableIp).toBe('192.168.1.1');
      expect(result.output.lastUsableIp).toBe('192.168.1.254');
      expect(result.output.subnetMask).toBe('255.255.255.0');
      expect(result.output.hostCount).toBe(256);
      expect(result.output.usableHostCount).toBe(254);
      expect(result.output.prefix).toBe(24);
    });

    it('should calculate CIDR for /16 network', async () => {
      const input = { cidr: '10.0.0.0/16' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('10.0.0.0');
      expect(result.output.broadcastAddress).toBe('10.0.255.255');
      expect(result.output.firstUsableIp).toBe('10.0.0.1');
      expect(result.output.lastUsableIp).toBe('10.0.255.254');
      expect(result.output.subnetMask).toBe('255.255.0.0');
      expect(result.output.hostCount).toBe(65536);
      expect(result.output.usableHostCount).toBe(65534);
      expect(result.output.prefix).toBe(16);
    });

    it('should calculate CIDR for /30 network (point-to-point)', async () => {
      const input = { cidr: '192.168.1.4/30' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('192.168.1.4');
      expect(result.output.broadcastAddress).toBe('192.168.1.7');
      expect(result.output.firstUsableIp).toBe('192.168.1.5');
      expect(result.output.lastUsableIp).toBe('192.168.1.6');
      expect(result.output.subnetMask).toBe('255.255.255.252');
      expect(result.output.hostCount).toBe(4);
      expect(result.output.usableHostCount).toBe(2);
      expect(result.output.prefix).toBe(30);
    });

    it('should calculate CIDR for /32 network (host route)', async () => {
      const input = { cidr: '192.168.1.1/32' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('192.168.1.1');
      expect(result.output.broadcastAddress).toBe('192.168.1.1');
      expect(result.output.firstUsableIp).toBe('192.168.1.1');
      expect(result.output.lastUsableIp).toBe('192.168.1.1');
      expect(result.output.subnetMask).toBe('255.255.255.255');
      expect(result.output.hostCount).toBe(1);
      expect(result.output.usableHostCount).toBe(1);
      expect(result.output.prefix).toBe(32);
    });

    it('should calculate CIDR for /8 network (Class A)', async () => {
      const input = { cidr: '10.0.0.0/8' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('10.0.0.0');
      expect(result.output.broadcastAddress).toBe('10.255.255.255');
      expect(result.output.firstUsableIp).toBe('10.0.0.1');
      expect(result.output.lastUsableIp).toBe('10.255.255.254');
      expect(result.output.subnetMask).toBe('255.0.0.0');
      expect(result.output.hostCount).toBe(16777216);
      expect(result.output.usableHostCount).toBe(16777214);
      expect(result.output.prefix).toBe(8);
    });

    it('should handle network address calculation correctly', async () => {
      const input = { cidr: '192.168.1.100/24' };

      const result = await registeredAction.action({ input });

      // Should calculate network address even when given a host IP
      expect(result.output.networkAddress).toBe('192.168.1.0');
      expect(result.output.broadcastAddress).toBe('192.168.1.255');
    });

    it('should throw error for invalid CIDR format', async () => {
      const input = { cidr: '192.168.1.0' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Invalid CIDR notation/,
      );
    });

    it('should throw error for invalid IP address', async () => {
      const input = { cidr: '256.256.256.256/24' };

      await expect(registeredAction.action({ input })).rejects.toThrow();
    });

    it('should throw error for invalid prefix length', async () => {
      const input = { cidr: '192.168.1.0/33' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Invalid prefix length/,
      );
    });

    it('should throw error for negative prefix length', async () => {
      const input = { cidr: '192.168.1.0/-1' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Invalid prefix length/,
      );
    });

    it('should handle edge case /0 network', async () => {
      const input = { cidr: '0.0.0.0/0' };

      const result = await registeredAction.action({ input });

      expect(result.output.networkAddress).toBe('0.0.0.0');
      expect(result.output.broadcastAddress).toBe('255.255.255.255'); // /0 covers entire IPv4 space
      expect(result.output.subnetMask).toBe('0.0.0.0'); // /0 has no subnet mask
      expect(result.output.hostCount).toBe(4294967296);
      expect(result.output.usableHostCount).toBe(4294967294);
      expect(result.output.prefix).toBe(0);
    });

    it('should handle different private network ranges', async () => {
      const testCases = [
        {
          cidr: '172.16.0.0/12',
          networkAddr: '172.16.0.0',
          broadcastAddr: '172.31.255.255',
        },
        {
          cidr: '192.168.0.0/16',
          networkAddr: '192.168.0.0',
          broadcastAddr: '192.168.255.255',
        },
        {
          cidr: '10.0.0.0/8',
          networkAddr: '10.0.0.0',
          broadcastAddr: '10.255.255.255',
        },
      ];

      for (const testCase of testCases) {
        const result = await registeredAction.action({
          input: { cidr: testCase.cidr },
        });
        expect(result.output.networkAddress).toBe(testCase.networkAddr);
        expect(result.output.broadcastAddress).toBe(testCase.broadcastAddr);
      }
    });
  });
});
