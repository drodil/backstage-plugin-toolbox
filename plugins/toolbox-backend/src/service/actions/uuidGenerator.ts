import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { randomUUID } from 'crypto';

export const createUuidGeneratorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'generate-uuid',
    title: 'Generate UUID',
    description: 'Generate UUIDs (v4) in various formats',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          count: z
            .number()
            .min(1)
            .max(100)
            .default(1)
            .describe('Number of UUIDs to generate'),
          format: z
            .enum(['standard', 'uppercase', 'nohyphens', 'braces'])
            .default('standard')
            .describe('Format of the UUID'),
        }),
      output: z =>
        z.object({
          uuids: z.array(z.string()).describe('Generated UUIDs'),
        }),
    },
    action: async ({ input }) => {
      const { count, format } = input;
      try {
        const uuids: string[] = [];

        for (let i = 0; i < count; i++) {
          let uuid: string = randomUUID();

          switch (format) {
            case 'uppercase':
              uuid = uuid.toUpperCase();
              break;
            case 'nohyphens':
              uuid = uuid.replace(/-/g, '');
              break;
            case 'braces':
              uuid = `{${uuid}}`;
              break;
            case 'standard':
            default:
              // Keep as is
              break;
          }

          uuids.push(uuid);
        }

        return { output: { uuids } };
      } catch (error) {
        throw new Error(`Failed to generate UUIDs: ${error.message}`);
      }
    },
  });
};
