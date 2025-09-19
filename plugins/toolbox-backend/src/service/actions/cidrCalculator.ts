import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

// IPv4 CIDR calculation functions
function ipToNumber(ip: string): number {
  return (
    ip
      .split('.')
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

function calculateCidr(cidr: string) {
  const [ip, prefixLength] = cidr.split('/');
  const prefix = parseInt(prefixLength, 10);

  if (prefix < 0 || prefix > 32) {
    throw new Error('Invalid prefix length. Must be between 0 and 32.');
  }

  const ipNum = ipToNumber(ip);

  // Handle special case for /0 prefix
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkAddress = (ipNum & mask) >>> 0;
  const broadcastAddress =
    prefix === 0 ? 0xffffffff : (networkAddress | (~mask >>> 0)) >>> 0;
  const hostCount = Math.pow(2, 32 - prefix);

  return {
    networkAddress: numberToIp(networkAddress),
    broadcastAddress: numberToIp(broadcastAddress),
    firstUsableIp:
      prefix === 32
        ? numberToIp(networkAddress)
        : numberToIp(networkAddress + 1),
    lastUsableIp:
      prefix === 32
        ? numberToIp(networkAddress)
        : numberToIp(broadcastAddress - 1),
    subnetMask: numberToIp(mask),
    hostCount: hostCount,
    usableHostCount: prefix === 32 ? 1 : Math.max(0, hostCount - 2),
    prefix: prefix,
  };
}

function isValidIpv4(ip: string): boolean {
  const parts = ip.split('.');
  return (
    parts.length === 4 &&
    parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    })
  );
}

export const createCidrCalculatorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'calculate-cidr',
    title: 'Calculate CIDR',
    description: 'Calculate network information from CIDR notation',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          cidr: z.string().describe('CIDR notation (e.g., 192.168.1.0/24)'),
        }),
      output: z =>
        z.object({
          networkAddress: z.string().describe('Network address'),
          broadcastAddress: z.string().describe('Broadcast address'),
          firstUsableIp: z.string().describe('First usable IP address'),
          lastUsableIp: z.string().describe('Last usable IP address'),
          subnetMask: z.string().describe('Subnet mask'),
          hostCount: z.number().describe('Total number of hosts'),
          usableHostCount: z.number().describe('Number of usable hosts'),
          prefix: z.number().describe('Prefix length'),
        }),
    },
    action: async ({ input }) => {
      const { cidr } = input;
      try {
        // Validate CIDR format
        if (!cidr.includes('/')) {
          throw new Error(
            'Invalid CIDR notation. Must include prefix length (e.g., 192.168.1.0/24)',
          );
        }

        const [ip, prefixStr] = cidr.split('/');

        if (!isValidIpv4(ip)) {
          throw new Error('Invalid IPv4 address');
        }

        const prefix = parseInt(prefixStr, 10);
        if (isNaN(prefix)) {
          throw new Error('Invalid prefix length');
        }

        const result = calculateCidr(cidr);

        return { output: result };
      } catch (error) {
        throw new Error(`Failed to calculate CIDR: ${error.message}`);
      }
    },
  });
};
