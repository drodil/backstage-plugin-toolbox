import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createWhoisLookupAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'lookup-whois',
    title: 'Lookup WHOIS',
    description: 'Perform WHOIS lookup for domains and IP addresses',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          domain: z.string().describe('Domain name or IP address to lookup'),
        }),
      output: z =>
        z.object({
          data: z.record(z.any()).describe('WHOIS data'),
        }),
    },
    action: async ({ input }) => {
      const { domain } = input;
      try {
        if (!domain || domain.trim() === '') {
          throw new Error('Domain is required');
        }

        // Dynamic import to handle potential module issues
        const whoiser = require('whoiser');
        const data = await whoiser(domain.trim());

        return { output: { data } };
      } catch (error) {
        throw new Error(`Failed to perform WHOIS lookup: ${error.message}`);
      }
    },
  });
};
