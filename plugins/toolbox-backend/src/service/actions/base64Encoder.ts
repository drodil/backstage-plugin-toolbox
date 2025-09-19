import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createBase64EncoderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'encode-decode-base64',
    title: 'Encode/Decode Base64',
    description: 'Encode or decode Base64 data',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          data: z.string().describe('Data to encode or decode'),
          mode: z.enum(['encode', 'decode']).describe('Operation mode'),
        }),
      output: z =>
        z.object({
          result: z.string().describe('Encoded or decoded result'),
        }),
    },
    action: async ({ input }) => {
      const { data, mode } = input;
      try {
        let result: string;
        if (mode === 'encode') {
          result = Buffer.from(data).toString('base64');
        } else {
          result = Buffer.from(data, 'base64').toString();
        }
        return { output: { result } };
      } catch (error) {
        throw new Error(`Failed to ${mode} Base64: ${error.message}`);
      }
    },
  });
};
